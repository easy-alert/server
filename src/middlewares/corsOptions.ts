import cors from 'cors';

// CHANGE HERE
const allowedOrigins = [
  'backoffice.easyalert.com.br',
  'company.easyalert.com.br',
  'public.easyalert.com.br',
  'sandbox.backoffice.easyalert.com.br',
  'sandbox.company.easyalert.com.br',
  'sandbox.public.easyalert.com.br',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
