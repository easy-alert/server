import fs from 'fs';
import path from 'path';

import PDFPrinter from 'pdfmake';
import sharp from 'sharp';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import type { Readable } from 'stream';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

import { updateChecklistReportPDF } from './updateChecklistReportPDF';

import { simplifyNameForURL } from '../../../../utils/dataHandler';
import { createFolder } from '../../../../utils/fs/createFolder';
import { deleteFolder } from '../../../../utils/fs/deleteFolder';
import { formatMonthYear } from '../../../../utils/dateTime';
import { sendErrorToServerLog } from '../../../../utils/messages/sendErrorToServerLog';

import type { IDataForPDF } from './createChecklistReportPDF';
import type { IFilterOptions } from '../controllers/generateChecklistReportPDFController';
import { dateTimeFormatter } from '../../../../utils/dateTime/dateTimeFormatter';

interface IChecklistPDFService {
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

function separateByMonth(checklists: IDataForPDF['checklists']) {
  const separatedByMonth: { [key: string]: IDataForPDF['checklists'] } = {};

  checklists.forEach((checklist) => {
    const monthYear = `${checklist.date.getMonth() + 1}-${checklist.date.getFullYear()}`;

    if (!separatedByMonth[monthYear]) {
      separatedByMonth[monthYear] = [];
    }

    separatedByMonth[monthYear].push(checklist);
  });

  const result = Object.keys(separatedByMonth).map((key) => ({
    month: formatMonthYear(key),
    data: separatedByMonth[key],
  }));

  return result;
}

const handleChecklistColors = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        name: 'Pendente',
        bgColor: '#D5D5D5',
        color: 'black',
      };

    case 'inProgress':
      return {
        name: 'Em andamento',
        bgColor: '#FFB200',
        color: 'white',
      };

    case 'approved':
      return {
        name: 'Conforme',
        bgColor: '#34B53A',
        color: 'white',
      };

    case 'completed':
      return {
        name: 'Concluído',
        bgColor: '#34B53A',
        color: 'white',
      };

    case 'rejected':
      return {
        name: 'Não conforme',
        bgColor: '#B21D1D',
        color: 'white',
      };

    default:
      return {
        name: 'Pendente',
        bgColor: '#D5D5D5',
        color: 'black',
      };
  }
};

export async function checklistPDFService({
  reportId,
  companyImage,
  dataForPDF,
  filterOptions,
}: IChecklistPDFService) {
  const folderName = `Folder-${Date.now()}`;

  try {
    createFolder(folderName);

    const isDicebear = companyImage?.includes('dicebear');

    const footerLogo = await downloadFromS3(
      'https://larguei.s3.us-west-2.amazonaws.com/LOGOPDF-1716384513443.png',
      folderName,
    );

    const headerLogo = isDicebear ? footerLogo : await downloadFromS3(companyImage!, folderName);

    const checklistForPdf = separateByMonth(dataForPDF.checklists);

    const fonts = {
      Arial: {
        normal: 'fonts/Arial/Arial.ttf',
        bold: 'fonts/Arial/ArialMedium.ttf',
      },
    };

    const printer = new PDFPrinter(fonts);
    const contentData: Content = [];

    const countData: Content = [
      {
        table: {
          widths: ['auto', 'auto', 'auto', '*'],
          body: [
            [
              {
                text: dataForPDF.pendingChecklistsCount,
                color: 'black',
                bold: true,
                marginLeft: 16,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: dataForPDF.inProgressChecklistsCount,
                color: '#FFB200',
                bold: true,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: dataForPDF.completedChecklistCount,
                color: '#34B53A',
                bold: true,
                fontSize: 12,
                alignment: 'center',
              },
              { text: ' ' },
            ],
            [
              {
                text: dataForPDF.pendingChecklistsCount > 1 ? 'Pendentes' : 'Pendente',
                color: '#999999',
                bold: true,
                marginLeft: 16,
              },
              {
                text: 'Em andamento',
                color: '#999999',
                bold: true,
              },
              {
                text: dataForPDF.completedChecklistCount > 1 ? 'Finalizados' : 'Finalizado',
                color: '#999999',
                bold: true,
              },
              { text: ' ' },
            ],
          ],
        },
        layout: 'noBorders',
        fillColor: '#E6E6E6',
        unbreakable: true,
        marginLeft: 32,
      },
    ];

    contentData.push(countData);

    for (const { data, month } of checklistForPdf) {
      contentData.push({
        text: month,
        fontSize: 14,
        marginTop: contentData.length > 0 ? 8 : 0,
        marginBottom: 4,
      });

      for (const checklist of data) {
        const {
          building,
          name: checklistName,
          description,
          observation,
          status,
          checklistItem,
          checklistUsers,
          images,
          date,
        } = checklist;

        const checklistStatusName = handleChecklistColors(status).name;
        const checklistStatusColor = handleChecklistColors(status).color;
        const checklistStatusBgColor = handleChecklistColors(status).bgColor;

        if (contentData.length > 0) {
          contentData.push({ text: ' ' });
        }

        const imagesForPDF: Content = [];
        const annexesForPDF: Content = [];

        await Promise.all(
          images.map(async ({ name, url }, index) => {
            if (!url) return;

            if (!name.includes('jpeg') && !name.includes('jpg') && !name.includes('png')) {
              annexesForPDF.push({
                text: `${name}${images.length === index + 1 ? '.' : ', '}`,
                link: url,
              });
            } else {
              const imageStream = await getImageStreamFromS3(url);
              const base64Image = await processImageToBase64(imageStream);

              imagesForPDF.push({
                image: base64Image,
                width: 100,
                height: 100,
                link: url,
              });
            }
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
          text: ` ${checklistStatusName} `,
          background: checklistStatusBgColor,
          color: checklistStatusColor,
          marginRight: 12,
          noWrap: true,
          bold: true,
        });

        contentData.push({
          columns: [
            {
              stack: [
                String(date.getDate()).padStart(2, '0'),
                capitalizeFirstLetter(
                  new Date(date)
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
              stack: [
                {
                  table: {
                    widths: [1, '*'],
                    body: [
                      [
                        {
                          text: '',
                          fillColor: checklistStatusBgColor,
                        },
                        {
                          table: {
                            body: [tags],
                          },
                          layout: 'noBorders',
                          marginLeft: 8,
                          marginTop: 8,
                        },
                      ],
                    ],
                  },
                  layout: 'noBorders',
                  fillColor: '#E6E6E6',
                },
                {
                  table: {
                    widths: [1, '*', '*', '*'],
                    body: [
                      [
                        {
                          text: '',
                          fillColor: checklistStatusBgColor,
                        },
                        {
                          text: [{ text: 'Nome: ', bold: true }, { text: checklistName }],
                          marginLeft: 8,
                        },
                        {
                          text: [
                            {
                              text:
                                checklistUsers.length === 0 || checklistUsers.length === 1
                                  ? 'Responsável: '
                                  : 'Responsáveis: ',
                              bold: true,
                            },
                            {
                              text: `${checklistUsers
                                .map((checklistUser) => checklistUser.user.name)
                                .join(', ')}`,
                            },
                          ],
                        },
                        {
                          text: [
                            { text: 'Data: ', bold: true },
                            { text: date.toLocaleDateString('pt-br') },
                          ],
                        },
                      ],
                    ],
                  },
                  layout: 'noBorders',
                  fillColor: '#E6E6E6',
                },
                {
                  table: {
                    widths: [1, '*'],
                    body: [
                      [
                        {
                          text: '',
                          fillColor: checklistStatusBgColor,
                        },
                        {
                          text: [
                            { text: 'Observação: ', bold: true },
                            { text: observation || description },
                          ],
                          marginLeft: 8,
                        },
                      ],
                    ],
                  },
                  layout: 'noBorders',
                  fillColor: '#E6E6E6',
                },
              ],
            },
          ],
          unbreakable: true,
        });

        const lastContent = contentData.length - 1;

        if (checklistItem && checklistItem.length > 0) {
          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: checklistStatusBgColor,
                  },
                  {
                    table: {
                      widths: [90, 90, '*'],
                      body: [
                        [
                          { text: 'Atualizado', bold: true },
                          { text: 'Status', bold: true },
                          { text: 'Item', bold: true },
                        ],
                        ...(checklistItem ?? []).map(
                          ({ name, status: checklistStatus, updatedAt }) => [
                            {
                              text:
                                updatedAt <= date ? 'Não alterado' : dateTimeFormatter(updatedAt),
                            },
                            {
                              text: ` ${handleChecklistColors(checklistStatus).name} `,
                              color: handleChecklistColors(checklistStatus).color,
                              background: handleChecklistColors(checklistStatus).bgColor,
                            },
                            { text: name },
                          ],
                        ),
                      ],
                    },
                    layout: 'lightHorizontalLines',
                    marginLeft: 8,
                    marginRight: 8,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: checklistStatusBgColor,
                  },
                  { text: '' },
                ],
              ],
            },
            layout: 'noBorders',
            fillColor: '#E6E6E6',
          });
        }

        if (imagesForPDF && imagesForPDF.length > 0) {
          const imagesRows = Math.ceil(imagesForPDF.length / 6);

          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: checklistStatusBgColor,
                    opacity: 1,
                  },
                  {
                    text: [{ text: `Imagens (${imagesForPDF.length || 0}): `, bold: true }],
                    marginLeft: 8,
                  },
                ],
              ],
            },
            layout: 'noBorders',
            fillColor: '#E6E6E6',
          });

          for (let row = 0; row < imagesRows; row++) {
            const start = row * 6;
            const end = start + 6;

            (contentData[lastContent] as any).columns[1].stack.push({
              table: {
                widths: [1, '*'],
                body: [
                  [
                    {
                      text: '',
                      fillColor: checklistStatusBgColor,
                    },
                    {
                      columns: imagesForPDF.slice(start, end),
                      columnGap: 4,
                      marginLeft: 8,
                    },
                  ],
                  [
                    {
                      text: '',
                      fillColor: checklistStatusBgColor,
                    },
                    { text: '' },
                  ],
                ],
              },
              layout: 'noBorders',
              fillColor: '#E6E6E6',
            });
          }
        }

        if (annexesForPDF && annexesForPDF.length > 0) {
          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: checklistStatusBgColor,
                    opacity: 1,
                  },
                  {
                    text: [{ text: `Anexos (${annexesForPDF.length || 0}): `, bold: true }],
                    marginLeft: 8,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: checklistStatusBgColor,
                    opacity: 1,
                  },
                  {
                    columns: [
                      {
                        stack: annexesForPDF,
                      },
                    ],
                    marginLeft: 8,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: checklistStatusBgColor,
                    opacity: 1,
                  },
                  { text: '' },
                ],
              ],
            },
            layout: 'noBorders',
            fillColor: '#E6E6E6',
          });
        }
      }
    }

    const docDefinitions: TDocumentDefinitions = {
      defaultStyle: { font: 'Arial', lineHeight: 1.1, fontSize: 10 },
      pageOrientation: 'landscape',
      pageSize: 'A4',
      pageMargins: [30, 100, 30, 30],

      header() {
        return {
          stack: [
            {
              text: 'Relatório de Checklist',
              fontSize: 20,
              bold: true,
              alignment: 'center',
              marginTop: 4,
              marginBottom: 4,
            },
            {
              columns: [
                {
                  image: path.join(folderName, headerLogo),
                  width: 64,
                  height: 64,
                  fit: [64, 64],
                  absolutePosition: { x: 64, y: 46 },
                },
                {
                  table: {
                    widths: ['*', 'auto'],
                    body: [
                      [
                        {
                          text: [
                            { text: 'Edificação: ', bold: true },
                            { text: filterOptions.buildingsNames },
                          ],
                          fontSize: 12,
                          marginLeft: 8,
                        },
                        {
                          text: [
                            { text: 'Período: ', bold: true },
                            { text: filterOptions.interval },
                          ],
                          fontSize: 12,
                          alignment: 'right',
                          marginRight: 8,
                        },
                      ],
                      [
                        {
                          text: '',
                          fontSize: 12,
                          marginLeft: 8,
                        },
                        {
                          text: [
                            { text: 'Emissão: ', bold: true },
                            { text: `${new Date().toLocaleString('pt-br')}` },
                          ],
                          fontSize: 12,
                          alignment: 'right',
                          marginRight: 8,
                        },
                      ],
                      [
                        {
                          text: [
                            { text: 'Status: ', bold: true },
                            { text: filterOptions.statusNames },
                          ],
                          fontSize: 12,
                          marginLeft: 8,
                        },
                        { text: ' ' },
                      ],
                    ],
                  },
                  fillColor: '#B21D1D',
                  color: '#FFFFFF',
                  margin: [70, 0, 30, 0],
                  layout: 'noBorders',
                },
              ],
            },
          ],
        };
      },

      content: [contentData],

      footer(currentPage, totalPages) {
        return {
          columns: [
            {
              image: path.join(folderName, footerLogo),
              alignment: 'left',
              marginLeft: 30,
              width: 64,
              height: 20,
            },
            {
              stack: [
                {
                  text: `Página ${currentPage} de ${totalPages}`,
                  alignment: 'right',
                  marginRight: 30,
                },
                {
                  text: [{ text: 'ID: ', bold: true }, { text: reportId }],
                  alignment: 'right',
                  marginRight: 30,
                },
              ],
            },
          ],
        };
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);
    const buffers: any = [];

    pdfDoc.on('data', (chunk) => {
      buffers.push(chunk);
    });

    const filename = `${simplifyNameForURL(`Relatorio_Checklists_${Date.now()}`)}.pdf`;

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

    await updateChecklistReportPDF({
      updatedChecklistReportPDF: {
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
    await updateChecklistReportPDF({
      updatedChecklistReportPDF: {
        id: reportId,
        status: 'failed',
      },
    });
  }
}
