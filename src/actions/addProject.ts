'use server';

import { getSession } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addProjectAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return { error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const techStackStr = formData.get('techStack') as string;
    const techStack = techStackStr.split(',').map((s) => s.trim());
    
    let imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!title || !category || !description) {
      return { error: 'Missing required fields' };
    }

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'projects' },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      const result = await uploadPromise;
      imageUrl = result.secure_url;
    }

    if (!imageUrl) {
      return { error: 'Image URL or File is required' };
    }

    await connectToDatabase();

    const newProject = await Project.create({
      title,
      category,
      description,
      techStack,
      imageUrl,
    });

    revalidatePath('/');
    revalidatePath('/projects');

    return { success: true, project: JSON.parse(JSON.stringify(newProject)) };
  } catch (error: any) {
    console.error('Error adding project:', error);
    return { error: error.message || 'Internal Server Error' };
  }
}
