import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import { Request } from 'express';

export const tempDirectory = path.resolve(__dirname, '..', '..', 'tmp');
export const storage = {
  storage: multer.diskStorage({
    destination: tempDirectory,
    filename: (request: Request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

export default {
  multer: multer(storage),
  directory: tempDirectory,
};
