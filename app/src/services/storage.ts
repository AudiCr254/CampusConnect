import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { FileMetadata } from './firestore';

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'units', 'notes')
 * @returns FileMetadata with download URL
 */
export async function uploadFile(file: File, folder: string): Promise<FileMetadata> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${filename}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      name: file.name,
      url: downloadURL,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - The download URL of the file
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract the path from the download URL
    const urlParams = new URL(fileUrl).searchParams;
    const filePath = decodeURIComponent(urlParams.get('alt') || '');
    
    if (filePath) {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw - file might already be deleted
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('video')) return '🎥';
  if (fileType.includes('audio')) return '🎵';
  return '📎';
}
