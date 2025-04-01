import { prisma } from '../../../../../prisma';

interface ICreateApiLogs {
  body: any;
  method: string;
  params: any;
  query: any;
  originalUrl: string;
}

export async function createApiLogs({ body, method, params, query, originalUrl }: ICreateApiLogs) {
  return prisma.apiLogs.create({
    data: {
      method,
      path: originalUrl,
      body: JSON.stringify(body),
      query: JSON.stringify(query),
      params: JSON.stringify(params),
    },
  });
}
