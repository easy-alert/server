import fs from 'fs';
import path from 'path';

import PDFPrinter from 'pdfmake';
import sharp from 'sharp';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import type { Readable } from 'stream';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

import { updateTicketReportPDF } from './updateTicketReportPDF';

import { simplifyNameForURL } from '../../../../utils/dataHandler';
import { createFolder } from '../../../../utils/fs/createFolder';
import { deleteFolder } from '../../../../utils/fs/deleteFolder';
import { formatMonthYear } from '../../../../utils/dateTime';
import { sendErrorToServerLog } from '../../../../utils/messages/sendErrorToServerLog';

import type { IDataForPDF } from './createTicketReportPDF';
import type { IFilterOptions } from '../controllers/generateTicketReportPDF';

interface ITicketPDFService {
  reportId: string;
  companyImage?: string;
  dataForPDF: IDataForPDF;
  filterOptions: IFilterOptions;
}

function capitalizeFirstLetter(string: string): string {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function uploadPDFToS3({ pdfBuffer, filename }: { pdfBuffer: Buffer; filename: string }) {
  const s3bucket = new S3Client({
    credentials: {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    },
    region: 'us-west-2',
  });

  try {
    await s3bucket.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: filename,
        Body: pdfBuffer,
        ACL: 'public-read',
        ContentType: 'application/pdf',
      }),
    );
  } catch (error) {
    sendErrorToServerLog({ stack: error, extraInfo: 'Erro nas funções que o Augusto fez' });
  }
}

async function downloadFromS3(url: string, folderName: string) {
  const s3bucket = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: 'us-west-2',
  });

  const key = url.split('/').pop() ?? '';

  const s3Params = {
    Bucket: url.includes('larguei') ? process.env.AWS_S3_BUCKET! : 'easy-alert',
    Key: key ? decodeURIComponent(key) : '',
  };

  const filePath = path.join(folderName, key);

  const { Body } = (await s3bucket.send(new GetObjectCommand(s3Params))) as { Body: Readable };

  await new Promise<void>((resolve, reject) => {
    Body!
      .pipe(fs.createWriteStream(filePath))
      .on('error', (err: any) => reject(err))
      .on('close', () => resolve());
  });

  return key;
}

// Função para obter um stream de imagem do S3
async function getImageStreamFromS3(url: string): Promise<Readable> {
  const s3bucket = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: 'us-west-2',
  });

  const key = url.split('/').pop() ?? '';

  const s3Params = {
    Bucket: url.includes('larguei') ? process.env.AWS_S3_BUCKET! : 'easy-alert',
    Key: key ? decodeURIComponent(key) : '',
  };

  const { Body } = (await s3bucket.send(new GetObjectCommand(s3Params))) as { Body: Readable };

  if (!Body) {
    throw new Error('Falha ao obter a imagem do S3');
  }

  return Body;
}

// Função para converter stream em buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks) as any));
    stream.on('error', reject);
  });
}

// Função para processar a imagem e convertê-la para base64
async function processImageToBase64(stream: Readable): Promise<string> {
  const buffer = await streamToBuffer(stream); // Converte o stream em buffer

  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: 300, height: 300, fit: 'inside' })
    .toBuffer();

  return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
}

function separateByMonth(tickets: IDataForPDF['tickets']) {
  const separatedByMonth: { [key: string]: IDataForPDF['tickets'] } = {};

  tickets.forEach((ticket) => {
    const monthYear = `${ticket.createdAt.getMonth() + 1}-${ticket.createdAt.getFullYear()}`;

    if (!separatedByMonth[monthYear]) {
      separatedByMonth[monthYear] = [];
    }

    separatedByMonth[monthYear].push(ticket);
  });

  const result = Object.keys(separatedByMonth).map((key) => ({
    month: formatMonthYear(key),
    data: separatedByMonth[key],
  }));

  return result;
}

export async function ticketPDFService({
  reportId,
  companyImage,
  dataForPDF,
  filterOptions,
}: ITicketPDFService) {
  const folderName = `Folder-${Date.now()}`;

  try {
    createFolder(folderName);

    const isDicebear = companyImage?.includes('dicebear');

    const footerLogo = await downloadFromS3(
      'https://larguei.s3.us-west-2.amazonaws.com/LOGOPDF-1716384513443.png',
      folderName,
    );

    const headerLogo = isDicebear ? footerLogo : await downloadFromS3(companyImage!, folderName);

    const ticketsForPdf = separateByMonth(dataForPDF.tickets);

    const fonts = {
      DMSans: {
        normal: 'fonts/Arial/DMSansRegular.ttf',
        bold: 'fonts/Arial/DMSansMedium.ttf',
      },
    };

    const printer = new PDFPrinter(fonts);
    const contentData: Content = [];

    const countData: Content = [
      {
        table: {
          widths: ['auto', 'auto', 'auto', 'auto', '*'],
          body: [
            [
              {
                text: dataForPDF.openTicketsCount,
                color: '#000000',
                bold: true,
                marginLeft: 16,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: dataForPDF.awaitingToFinishTicketsCount,
                color:
                  dataForPDF.ticketsStatus.find((status) => status.name === 'awaitingToFinish')
                    ?.backgroundColor || '#000000',
                bold: true,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: dataForPDF.finishedTicketsCount,
                color:
                  dataForPDF.ticketsStatus.find((status) => status.name === 'finished')
                    ?.backgroundColor || '#000000',
                bold: true,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: dataForPDF.dismissedTicketsCount,
                color:
                  dataForPDF.ticketsStatus.find((status) => status.name === 'dismissed')
                    ?.backgroundColor || '#000000',
                bold: true,
                fontSize: 12,
                alignment: 'center',
              },
              { text: ' ' },
            ],
            [
              {
                text: dataForPDF.openTicketsCount > 1 ? 'Abertos' : 'Aberto',
                color: '#999999',
                bold: true,
                marginLeft: 16,
              },
              {
                text: 'Aguardando finalização',
                color: '#999999',
                bold: true,
              },
              {
                text: dataForPDF.finishedTicketsCount > 1 ? 'Finalizados' : 'Finalizado',
                color: '#999999',
                bold: true,
              },
              {
                text: dataForPDF.dismissedTicketsCount > 1 ? 'Indeferidos' : 'Indeferido',
                color: '#999999',
                bold: true,
              },
              { text: ' ' },
            ],
          ],
        },
        layout: 'noBorders',
        marginTop: 0,
        marginLeft: 40,
        marginBottom: 20,
        unbreakable: true,
        fillColor: '#E6E6E6',
      },
    ];

    contentData.push(countData);

    for (const { data, month } of ticketsForPdf) {
      contentData.push({
        text: month,
        fontSize: 14,
        marginTop: contentData.length > 0 ? 8 : 0,
        marginBottom: 4,
      });

      for (const ticket of data) {
        const {
          createdAt,
          description,
          images,
          place,
          status,
          types,
          building,
          residentName,
          residentEmail,
          residentApartment,
        } = ticket;

        if (contentData.length > 0) {
          contentData.push({ text: ' ' });
        }

        const imagesForPDF: Content = [];

        await Promise.all(
          images.slice(0, 4).map(async ({ url }) => {
            const imageStream = await getImageStreamFromS3(url);
            const base64Image = await processImageToBase64(imageStream);

            imagesForPDF.push({
              image: base64Image,
              width: 50,
              height: 50,
              link: url,
            });
          }),
        );

        const tags: Content = [];

        tags.push({
          text: building.name,
          marginRight: 12,
          fontSize: 12,
          bold: true,
          noWrap: true,
        });

        tags.push({
          text: ` ${status.label} `,
          background: status.backgroundColor,
          color: status.color,
          marginRight: 12,
          noWrap: true,
          bold: true,
        });

        types.forEach(({ type }) => {
          tags.push({
            text: ` ${type.label} `,
            background: type.backgroundColor,
            color: type.color,
            marginRight: 12,
            noWrap: true,
            bold: true,
          });
        });

        contentData.push({
          columns: [
            {
              stack: [
                String(createdAt.getDate()).padStart(2, '0'),
                capitalizeFirstLetter(
                  new Date(createdAt)
                    .toLocaleString('pt-br', {
                      weekday: 'long',
                    })
                    .substring(0, 3),
                ),
              ],
              width: 40,
              color: '#999999',
              fontSize: 14,
              bold: true,
            },
            {
              table: {
                widths: [1, '*', 'auto', '*'],
                body: [
                  [
                    {
                      text: '',
                      fillColor: status.backgroundColor,
                      opacity: 1,
                    },
                    {
                      table: {
                        body: [tags],
                      },
                      layout: 'noBorders',
                      marginLeft: 8,
                      marginTop: 8,
                    },
                    { text: '' },
                    { text: '' },
                  ],
                  [
                    {
                      text: '',
                      fillColor: status.backgroundColor,
                    },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                  ],
                  [
                    {
                      text: '',
                      fillColor: status.backgroundColor,
                    },
                    {
                      text: [{ text: 'Morador: ', bold: true }, { text: residentName }],
                      marginLeft: 8,
                    },
                    {
                      text: [{ text: 'Descrição: ', bold: true }, { text: description }],
                      marginLeft: 8,
                    },
                    {
                      text: `Imagens (${images.length || 0}): `,
                      marginLeft: 8,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: '',
                      fillColor: status.backgroundColor,
                    },
                    {
                      text: [{ text: 'Apartamento: ', bold: true }, { text: residentApartment }],
                      marginLeft: 8,
                    },
                    {
                      text: [{ text: 'Local: ', bold: true }, { text: place.label }],
                      marginLeft: 8,
                    },
                    {
                      columns: imagesForPDF,
                      marginLeft: 8,
                      columnGap: 8,
                    },
                  ],
                  [
                    {
                      text: '',
                      fillColor: status.backgroundColor,
                    },
                    {
                      text: [{ text: 'E-mail: ', bold: true }, { text: residentEmail }],
                      marginLeft: 8,
                    },
                    {
                      text: '',
                    },
                    {
                      text: '',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
              fillColor: '#E6E6E6',
            },
          ],
          unbreakable: true,
        });
      }
    }

    const docDefinitions: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      defaultStyle: { font: 'DMSans', lineHeight: 1.1, fontSize: 10 },
      pageMargins: [30, 110, 30, 30],
      footer(currentPage, totalPages) {
        return {
          columns: [
            {
              image: path.join(folderName, footerLogo),
              alignment: 'left',
              marginLeft: 30,
              marginBottom: 40,
              width: 92,
              height: 20,
            },
            {
              text: `Página ${currentPage} de ${totalPages}`,
              alignment: 'right',
              marginRight: 30,
              marginBottom: 40,
            },
          ],
        };
      },
      header() {
        return {
          columns: [
            {
              image: path.join(folderName, headerLogo),
              width: 60,
            },
            { text: ' ', width: 8 },
            [
              {
                text: [
                  { text: 'Edificação:', bold: true },
                  { text: ' ' },
                  { text: filterOptions.buildingsNames },
                ],
                fontSize: 12,
              },
              {
                text: [
                  { text: 'Local:', bold: true },
                  { text: ' ' },
                  { text: filterOptions.placesNames },
                ],
                fontSize: 12,
              },
              {
                text: [
                  { text: 'Tipo de serviço:', bold: true },
                  { text: ' ' },
                  { text: filterOptions.serviceTypesNames },
                ],
                fontSize: 12,
              },
              {
                text: [
                  { text: 'Status:', bold: true },
                  { text: ' ' },
                  {
                    text: filterOptions.statusNames,
                  },
                ],
                fontSize: 12,
              },
            ],
            [
              {
                text: [
                  { text: 'ID:', bold: true },
                  { text: ' ' },
                  {
                    text: reportId,
                  },
                ],
                alignment: 'right',
                fontSize: 12,
              },
              {
                text: [
                  {
                    text: 'Período:',
                    bold: true,
                  },
                  { text: ' ' },
                  {
                    text: filterOptions.interval,
                  },
                ],
                alignment: 'right',
                fontSize: 12,
              },

              {
                text: [
                  { text: 'Emissão:', bold: true },
                  { text: ' ' },
                  {
                    text: `${new Date().toLocaleString('pt-br')}`,
                  },
                ],
                alignment: 'right',
                fontSize: 12,
              },
            ],
          ],
          margin: 30,
        };
      },

      content: [contentData],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);
    const buffers: any = [];

    pdfDoc.on('data', (chunk) => {
      buffers.push(chunk);
    });

    const filename = `${simplifyNameForURL(`Relatorio_Chamados_${Date.now()}`)}.pdf`;

    await new Promise<void>((resolve, reject) => {
      pdfDoc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(buffers);
          await uploadPDFToS3({ pdfBuffer, filename });
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      pdfDoc.on('error', reject);
      pdfDoc.end();
    });

    deleteFolder(folderName);

    const bucketUrl = 'https://larguei.s3.us-west-2.amazonaws.com/';
    const pdfLink = bucketUrl + filename;

    await updateTicketReportPDF({
      updatedTicketReportPDF: {
        id: reportId,
        url: pdfLink,
        status: 'finished',
      },
    });
  } catch (error) {
    sendErrorToServerLog({ stack: error, extraInfo: 'Erro nas funções que o Augusto fez' });

    deleteFolder(folderName);
    // eslint-disable-next-line no-console
    console.error(error);
    await updateTicketReportPDF({
      updatedTicketReportPDF: {
        id: reportId,
        status: 'failed',
      },
    });
  }
}
