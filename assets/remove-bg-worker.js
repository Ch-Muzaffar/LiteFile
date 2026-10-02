/* ============================================================
   LiteFile — Background Removal Worker
   remove-bg-worker.js | litefile.cloud

   Loads briaai/RMBG-1.4 via Transformers.js (CDN).
   Model is ~176MB, cached by the browser after first download.
   ============================================================ */

'use strict';

importScripts('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');

const { AutoModel, AutoProcessor, RawImage, env } = self.transformers;

// Use browser Cache Storage — model files persist between sessions
env.allowLocalModels  = false;
env.useBrowserCache   = true;

let model     = null;
let processor = null;

const MODEL_ID = 'briaai/RMBG-1.4';

const PROCESSOR_CONFIG = {
  do_normalize: true,
  do_pad: false,
  do_rescale: true,
  do_resize: true,
  image_mean: [0.5, 0.5, 0.5],
  feature_extractor_type: 'ImageFeatureExtractor',
  image_std: [1, 1, 1],
  resample: 2,
  rescale_factor: 0.00392156862745098,
  size: { width: 1024, height: 1024 },
};

async function loadModel() {
  if (model && processor) return;

  model = await AutoModel.from_pretrained(MODEL_ID, {
    config: { model_type: 'custom' },
    progress_callback: (data) => {
      self.postMessage({ type: 'modelProgress', data });
    },
  });

  processor = await AutoProcessor.from_pretrained(MODEL_ID, {
    config: PROCESSOR_CONFIG,
  });
}

self.onmessage = async (event) => {
  if (event.data.type !== 'process') return;

  const { dataURL } = event.data;

  try {
    // Step 1: Load model (uses cache on repeat visits, ~instant)
    await loadModel();
    self.postMessage({ type: 'modelReady' });

    // Step 2: Load image and run inference
    self.postMessage({ type: 'inferenceStart' });

    const image = await RawImage.fromURL(dataURL);
    const { pixel_values } = await processor(image);
    const { output } = await model({ input: pixel_values });

    // Step 3: Extract alpha mask, resize to original image dimensions
    // output[0] shape: [1, 1, 1024, 1024] → squeeze batch → [1, 1024, 1024]
    const maskTensor  = output[0].mul(255).to('uint8').squeeze(0);
    const mask        = await RawImage.fromTensor(maskTensor);
    const resizedMask = await mask.resize(image.width, image.height);

    // Step 4: Transfer mask to main thread (transferable for zero-copy)
    const maskData = new Uint8Array(resizedMask.data);
    self.postMessage({
      type:   'result',
      maskData,
      width:  image.width,
      height: image.height,
    }, [maskData.buffer]);

  } catch (err) {
    self.postMessage({
      type:    'error',
      message: err.message || 'Processing failed. Please try a different image.',
    });
  }
};
