const Downloader: any = require('image-downloader');
import { resolve } from 'path';
import { Attachment, Item } from '../types';

/**
 * Download and write an image from the web to disk
 * @param {Object} param
 * @param {string} param.imageUrl - The direct url for the image to download
 * @param {string} param.filename - The filename used when saving the downloaded image
 * @return {Promise<Attachment>} Object containing filename (path) & buffer of image (image)
 */
const downloadImage = async ({ imageUrl, filename }: Item): Promise<Attachment> => {
  const dest: string = resolve(__dirname, `./../../downloads/${filename}`);
  const file: Attachment = await Downloader.image({ url: imageUrl, dest });
  return file;
};

export default downloadImage;
