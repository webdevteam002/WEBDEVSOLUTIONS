'use server';

import { getSession } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicIdFromUrl(url: string) {
  try {
    const parts = url.split('/');
    const fileWithExtension = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicId = fileWithExtension.split('.')[0];
    return `${folder}/${publicId}`;
  } catch (e) {
    return null;
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return { error: 'Unauthorized' };
    }

    await connectToDatabase();
    
    const project = await Project.findById(id);
    if (!project) {
      return { error: 'Project not found' };
    }

    // Try to delete image from Cloudinary if it's a Cloudinary URL
    if (project.imageUrl && project.imageUrl.includes('res.cloudinary.com')) {
      const publicId = getPublicIdFromUrl(project.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Project.findByIdAndDelete(id);

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return { error: error.message || 'Internal Server Error' };
  }
}

export async function editProjectAction(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return { error: 'Unauthorized' };
    }

    await connectToDatabase();

    const project = await Project.findById(id);
    if (!project) {
      return { error: 'Project not found' };
    }

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const techStackStr = formData.get('techStack') as string;
    const techStack = techStackStr ? techStackStr.split(',').map((s) => s.trim()) : undefined;

    let newImageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

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
      newImageUrl = result.secure_url;
    }

    if (newImageUrl && newImageUrl !== project.imageUrl) {
      // Optionally delete the old image from Cloudinary
      if (project.imageUrl && project.imageUrl.includes('res.cloudinary.com')) {
        const publicId = getPublicIdFromUrl(project.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(() => {});
        }
      }
      project.imageUrl = newImageUrl;
    }

    if (title) project.title = title;
    if (category) project.category = category;
    if (description) project.description = description;
    if (techStack) project.techStack = techStack;

    await project.save();

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/dashboard');

    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    console.error('Error editing project:', error);
    return { error: error.message || 'Internal Server Error' };
  }
}
