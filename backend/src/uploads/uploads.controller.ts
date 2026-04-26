import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = diskStorage({
  destination: (req, file, cb) => {
    // ✅ Usar ruta absoluta para evitar errores
    const uploadsPath = join(process.cwd(), 'uploads');
    console.log('📁 Uploads path:', uploadsPath);
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

@Controller('uploads')
export class UploadsController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        // Only allow images
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Return the URL to access the file
    const fileUrl = `http://localhost:3001/uploads/${file.filename}`;

    return {
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
