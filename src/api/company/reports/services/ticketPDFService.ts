import path from 'path';

import PDFPrinter from 'pdfmake';

import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

import { updateTicketReportPDF } from './updateTicketReportPDF';

import { capitalizeFirstLetter, simplifyNameForURL } from '../../../../utils/dataHandler';
import { createFolder } from '../../../../utils/fs/createFolder';
import { deleteFolder } from '../../../../utils/fs/deleteFolder';
import { formatMonthYear } from '../../../../utils/dateTime';
import { sendErrorToServerLog } from '../../../../utils/messages/sendErrorToServerLog';
import { downloadFromS3 } from '../../../../utils/aws/downloadFromS3';
import { processImagesForPDF } from '../../../../utils/processors/pdfImageProcessor';
import { ensurePdfCompatibleImage } from '../../../../utils/sharp/imageFormatConverter';
import { uploadPDFToS3 } from '../../../../utils/aws/uploadPDFToS3';

import type { IDataForPDF } from './createTicketReportPDF';
import type { IFilterOptions } from '../controllers/generateTicketReportPDF';
import { formattedDownloadFromS3 } from '../../../../utils/aws/formattedDownloadFromS3';

interface ITicketPDFService {
  reportId: string;
  companyImage?: string;
  dataForPDF: IDataForPDF;
  filterOptions: IFilterOptions;
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

    const footerLogoFile = await downloadFromS3(
      'https://larguei.s3.us-west-2.amazonaws.com/LOGOPDF-1716384513443.png',
      folderName,
    );

    let headerLogoPath: string;
    let headerLogoPathRaw: string;

    if (isDicebear) {
      headerLogoPathRaw = path.join(folderName, footerLogoFile);
      headerLogoPath = await ensurePdfCompatibleImage(headerLogoPathRaw);
    } else {
      headerLogoPathRaw = await formattedDownloadFromS3({
        url: companyImage!,
        folderName,
        targetFormat: 'png',
      });
      headerLogoPath = await ensurePdfCompatibleImage(headerLogoPathRaw);
    }

    const footerLogoPathRaw = path.join(folderName, footerLogoFile);
    const footerLogoPath = await ensurePdfCompatibleImage(footerLogoPathRaw);

    const ticketsForPdf = separateByMonth(dataForPDF.tickets);

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
        fillColor: '#E6E6E6',
        unbreakable: true,
        marginLeft: 32,
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

        const selectedImages: typeof images = [];
        const annexesForPDF: Content = [];
        const selectedAnnexes: typeof images = [];

        await Promise.all(
          images.map(async (image) => {
            if (!image.url) return;

            const isImage =
              image.name.includes('jpeg') ||
              image.name.includes('jpg') ||
              image.name.includes('png');

            if (isImage) {
              selectedImages.push(image);
            } else {
              selectedAnnexes.push(image);
            }
          }),
        );

        selectedAnnexes.forEach(({ name: annexName, url }, index) => {
          annexesForPDF.push({
            text: `${annexName}${selectedAnnexes.length === index + 1 ? '.' : ', '}`,
            link: url,
          });
        });

        // Process images for PDF using shared utility
        const { imagesForPDF, skippedImages } = await processImagesForPDF({
          images: selectedImages || [],
          width: 100,
          height: 100,
        });

        // Defensive: filter out any invalid image objects before using in PDF
        const validImagesForPDF = (imagesForPDF || []).filter(
          (img) => img && typeof img.image === 'string' && img.image.startsWith('data:image/'),
        );

        if (imagesForPDF.length !== validImagesForPDF.length) {
          console.error(
            '[PDFService] Some invalid image objects were filtered out before PDF content:',
            imagesForPDF,
          );
        }

        if (skippedImages.length > 0) {
          (contentData as any).push({
            text: [
              { text: 'Atenção: ', bold: true, color: 'red' },
              `Algumas imagens não foram incluídas no PDF por problemas de URL, formato ou processamento.`,
              '\n',
              ...skippedImages.map((img) => `- ${img.url} (${img.reason})\n`),
            ],
            fontSize: 8,
            margin: [0, 4, 0, 4],
            color: 'red',
          });
        }

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
              stack: [
                {
                  table: {
                    widths: [1, '*'],
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
                      ],
                    ],
                  },
                  layout: 'noBorders',
                  fillColor: '#E6E6E6',
                },
                {
                  table: {
                    widths: [1, '*', '*'],
                    body: [
                      [
                        {
                          text: '',
                          fillColor: status.backgroundColor,
                        },
                        {
                          text: [{ text: 'Local: ', bold: true }, { text: place.label }],
                          marginLeft: 8,
                        },
                        {
                          text: [{ text: 'Morador: ', bold: true }, { text: residentName }],
                        },
                      ],
                      [
                        {
                          text: '',
                          fillColor: status.backgroundColor,
                        },
                        {
                          text: [
                            { text: 'Apartamento: ', bold: true },
                            { text: residentApartment },
                          ],
                          marginLeft: 8,
                        },
                        {
                          text: [{ text: 'E-mail: ', bold: true }, { text: residentEmail }],
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
                          fillColor: status.backgroundColor,
                        },
                        {
                          text: [{ text: 'Descrição: ', bold: true }, { text: description }],
                          marginLeft: 8,
                        },
                      ],
                      [
                        {
                          text: '',
                          fillColor: status.backgroundColor,
                        },
                        { text: '' },
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

        if (annexesForPDF && annexesForPDF.length > 0) {
          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: status.backgroundColor,
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
                    fillColor: status.backgroundColor,
                    opacity: 1,
                  },
                  {
                    stack: annexesForPDF,
                    marginLeft: 8,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: status.backgroundColor,
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

        if (validImagesForPDF && validImagesForPDF.length > 0) {
          const imagesRows = Math.ceil(validImagesForPDF.length / 6);

          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: status.backgroundColor,
                    opacity: 1,
                  },
                  {
                    text: [{ text: `Imagens (${validImagesForPDF.length || 0}): `, bold: true }],
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
                      fillColor: status.backgroundColor,
                    },
                    {
                      columns: validImagesForPDF.slice(start, end),
                      columnGap: 4,
                      marginLeft: 8,
                    },
                  ],
                  [
                    {
                      text: '',
                      fillColor: status.backgroundColor,
                    },
                    { text: '' },
                  ],
                ],
              },
              layout: 'noBorders',
              fillColor: '#E6E6E6',
            });
          }
        } else if (selectedImages && selectedImages.length > 0) {
          // If there were images requested but all were skipped, show a placeholder message
          (contentData[lastContent] as any).columns[1].stack.push({
            text: [
              { text: 'Atenção: ', bold: true, color: 'red' },
              'Nenhuma imagem pôde ser incluída neste PDF por problemas de acesso, formato ou processamento.',
            ],
            fontSize: 8,
            margin: [0, 4, 0, 4],
            color: 'red',
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
              text: 'Relatório de Chamados',
              fontSize: 20,
              bold: true,
              alignment: 'center',
              marginTop: 4,
              marginBottom: 4,
            },
            {
              columns: [
                {
                  image: headerLogoPath,
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
                          text: [
                            { text: 'Local: ', bold: true },
                            { text: filterOptions.placesNames },
                          ],
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
                            { text: 'Tipo de serviço: ', bold: true },
                            { text: filterOptions.serviceTypesNames },
                          ],
                          fontSize: 12,
                          marginLeft: 8,
                        },
                        { text: ' ' },
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
              image: footerLogoPath,
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
