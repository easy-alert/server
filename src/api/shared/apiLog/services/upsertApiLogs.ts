import { prisma } from '../../../../../prisma';

interface IUpsertApiLogs {
  companyId: string;
  userId: any;
  apiLogId?: string;
  body: any;
  method: string;
  params: any;
  query: any;
  originalUrl: string;
}

export async function upsertApiLogs({
  companyId,
  userId,
  apiLogId,
  body,
  method,
  params,
  query,
  originalUrl,
}: IUpsertApiLogs) {
  return prisma.apiLogs.upsert({
    where: {
      id: apiLogId,
    },
    create: {
      method,
      path: originalUrl,
      body: JSON.stringify(body),
      query: JSON.stringify(query),
      params: JSON.stringify(params),
      userId,
      companyId,
    },
    update: {
      userId,
      companyId,
    },
  });
}
