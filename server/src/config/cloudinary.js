const fs = require('fs');
const path = require('path');

const uploadToCloudinary = async (fileBuffer, folder = 'produce_platform') => {
  try {
    if (!fileBuffer) {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
    }

    const uploadsDir = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, fileBuffer);

    return `/uploads/${folder}/${filename}`;
  } catch (err) {
    console.error('Local File Storage Error:', err);
    const base64 = fileBuffer ? fileBuffer.toString('base64') : '';
    return base64 ? `data:image/jpeg;base64,${base64}` : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
  }
};

module.exports = { uploadToCloudinary };

