import sharp from 'sharp';

async function generate() {
  const input = 'public/guyub_rukun_icon.jpg'; // Since it's square 1024x1024
  await sharp(input).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(input).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(input).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  
  // Also copy it to guyubrukun.png if they want guyubrukun.png to be the same
  // Wait, let's just make the icons
  console.log('Icons generated successfully');
}

generate().catch(console.error);
