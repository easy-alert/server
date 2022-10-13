import cors from 'cors';

// CHANGE HERE
const allowedOrigins = [
  'http://backoffice-easyalert-sandbox.s3-website-us-west-2.amazonaws.com/',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
