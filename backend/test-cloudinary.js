require('dotenv').config({ path: __dirname + '/.env' });
const path = require('path');
const fs = require('fs');
const {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
} = require('./config/cloudinary');

async function testCloudinaryPipeline() {
  console.log('☁️ Testing Cloudinary Live Media Integration...\n');

  console.log('1. Checking Configuration:');
  console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.slice(0, 6)}...` : 'MISSING');
  console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '******' : 'MISSING');
  console.log('   isCloudinaryConfigured():', isCloudinaryConfigured());

  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is not properly configured.');
    process.exit(1);
  }

  try {
    // 2. Ping Cloudinary API
    console.log('\n2. Testing Cloudinary API Authentication (Ping)...');
    const pingResult = await cloudinary.api.ping();
    console.log('   Ping Status:', pingResult.status); // should be 'ok'
    if (pingResult.status !== 'ok') {
      throw new Error(`Cloudinary ping failed with status: ${pingResult.status}`);
    }

    // 3. Upload an actual image file to Cloudinary
    console.log('\n3. Testing Media Upload to Cloudinary (axz_materials folder)...');
    // Copy an actual verified JPEG image to a temp location for test
    const sourceImage = path.join(__dirname, '..', 'frontend', 'public', 'images', 'updated', 'bricks-red-clay.jpeg');
    const tempTestFile = path.join(__dirname, 'temp-test-image.jpeg');
    fs.copyFileSync(sourceImage, tempTestFile);

    const uploadRes = await uploadToCloudinary(tempTestFile, {
      folder: 'axz_materials/tests',
      tags: ['test_upload', 'axz_verification'],
    });

    console.log('   Upload Success!');
    console.log('   Public ID:', uploadRes.publicId);
    console.log('   Secure URL:', uploadRes.url);
    console.log('   Format:', uploadRes.format);
    console.log('   Bytes:', uploadRes.bytes);

    if (!uploadRes.url.includes('cloudinary.com')) {
      throw new Error('Upload did not return a valid Cloudinary URL.');
    }

    // 4. Test Deletion from Cloudinary
    console.log('\n4. Testing Media Deletion from Cloudinary...');
    const delRes = await deleteFromCloudinary(uploadRes.publicId);
    console.log('   Delete Status:', delRes ? 'OK' : 'FAILED');

    console.log('\n=============================================');
    console.log('✅ CLOUDINARY LIVE MEDIA PIPELINE FULLY VERIFIED!');
    console.log('=============================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Cloudinary Pipeline Verification Failed:', err);
    process.exit(1);
  }
}

testCloudinaryPipeline();
