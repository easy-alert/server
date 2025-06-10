import type { MulterError } from 'multer';

import { ServerMessage } from './serverMessage';

import 'dotenv/config';

const fileSizeLimit = process.env.FILE_SIZE_LIMIT;

export function handleMulterError(err: MulterError, duration: number): ServerMessage {
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      console.warn(`[UPLOAD WARNING] ${err.message} | Duration: ${duration}ms`);

      return new ServerMessage({
        statusCode: 400,
        message: `Tamanho máximo do arquivo excedido. O tamanho máximo é de ${fileSizeLimit}MB.`,
      });

    case 'LIMIT_UNEXPECTED_FILE':
      console.warn(`[UPLOAD WARNING] ${err.message} | Duration: ${duration}ms`);

      return new ServerMessage({
        statusCode: 400,
        message: 'Arquivo inesperado. Verifique o nome do campo enviado.',
      });

    default:
      console.error(`[UPLOAD ERROR] ${err.message} | Duration: ${duration}ms`);

      return new ServerMessage({
        statusCode: 400,
        message: 'Erro ao efetuar upload do arquivo.',
      });
  }
}
