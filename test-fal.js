const fal = require("@fal-ai/serverless-client");

// Configure FAL client
const FAL_API_KEY = "71163de2-482a-46e5-821c-ccef71f7caae:2cec66a501188bdb77c78e85191693ba";

fal.config({
  credentials: FAL_API_KEY,
});

async function testFalAI() {
  try {
    console.log('Testing FAL AI connection...');
    console.log('API Key:', FAL_API_KEY ? `${FAL_API_KEY.substring(0, 10)}...` : 'Not set');

    // Test simple image generation
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: "a simple red apple",
        image_size: "square_hd",
        num_inference_steps: 4,
        guidance_scale: 3.5,
        seed: 42,
      },
      logs: true,
    });

    console.log('Test result:', JSON.stringify(result, null, 2));

    if (result && result.images && result.images.length > 0) {
      console.log('✅ SUCCESS: Image generated successfully!');
      console.log('Image URL:', result.images[0].url);
    } else {
      console.log('❌ FAILED: No image in result');
    }

  } catch (error) {
    console.error('❌ FAL AI test error:', error.message);
    console.error('Full error:', error);
  }
}

testFalAI();
