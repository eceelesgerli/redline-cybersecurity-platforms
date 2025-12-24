import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: string, folder: string = 'redline-hero'): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto' },
      { format: 'auto' },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadBlogImage(file: string): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'redline-blogs',
    transformation: [
      { quality: 'auto' },
      { format: 'auto' },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
