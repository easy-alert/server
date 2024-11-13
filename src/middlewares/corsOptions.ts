import cors from 'cors';

// CHANGE HERE
const allowedOrigins = [
  'https://backoffice.easyalert.com.br',
  'https://company.easyalert.com.br',
  'https://public.easyalert.com.br',
  'https://sandbox.backoffice.easyalert.com.br',
  'https://sandbox.company.easyalert.com.br',
  'https://sandbox.public.easyalert.com.br',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://10.109.0.26:3000',
];

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
