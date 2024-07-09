/* eslint-disable no-loop-func */
// #region IMPORTS
import PDFPrinter from 'pdfmake';
import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { IMaintenancesData } from '../services/types';
import { BuildingReportsServices } from '../services/buildingReportsServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { mask, simplifyNameForURL } from '../../../../../utils/dataHandler';
import { dateFormatter, setToUTCMidnight } from '../../../../../utils/dateTime';

// CLASS
const buildingReportsServices = new BuildingReportsServices();

// #endregion

// #region Functions
export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

function formatMonthYear(monthYear: string): string {
  const [month, year] = monthYear.split('-');
  const monthAbbreviation = new Date(`${year}/${month}/01`)
    .toLocaleString('pt-br', {
      month: 'long',
    })
    .substring(0, 3);
  return `${capitalizeFirstLetter(monthAbbreviation)}/${year.slice(2)}`;
}

function separateByMonth(array: IMaintenancesData[]) {
  const separatedByMonth: { [key: string]: IMaintenancesData[] } = {};

  array.forEach((data) => {
    const monthYear = `${
      data.notificationDate.getMonth() + 1
    }-${data.notificationDate.getFullYear()}`;

    if (!separatedByMonth[monthYear]) {
      separatedByMonth[monthYear] = [];
    }

    separatedByMonth[monthYear].push(data);
  });

  const result = Object.keys(separatedByMonth).map((key) => ({
    month: formatMonthYear(key),
    data: separatedByMonth[key],
  }));

  return result;
}

// #endregion

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
    // eslint-disable-next-line no-console
    console.error(error);
    throw new ServerMessage({
      message: 'Erro ao salvar PDF no S3.',
      statusCode: 500,
    });
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
    Key: key ? decodeURI(key) : '',
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

function deleteFolder(folderName: string) {
  fs.rmSync(folderName, { force: true, recursive: true });
}

const getStatusBackgroundColor = (status: string) => {
  const backgroundColor: any = {
    completed: '#34B53A', // theme.color.success
    overdue: '#E66666', // theme.color.primaryM
    pending: '#FFB200', // theme.color.warning
    expired: '#FF3508', // theme.color.actionDanger
    occasional: '#8A1FDF', // theme.color.purple
    inProgress: '#28A5FF', // theme.color.actionBlue
  };

  return backgroundColor[status];
};

const getSingularStatusNameforPdf = (status: string) => {
  let statusName = '';

  switch (status) {
    case 'expired':
      statusName = 'Vencida';
      break;

    case 'pending':
      statusName = 'Pendente';
      break;

    case 'completed':
      statusName = 'Concluída';
      break;

    case 'overdue':
      statusName = 'Feita em atraso';
      break;

    default:
      break;
  }

  return statusName;
};

export async function generateMaintenanceReportPDF(req: Request, res: Response) {
  const { query } = req as any;

  const queryFilter = buildingReportsServices.mountQueryFilter({ query: req.query as any });
  const { maintenancesHistory, company } =
    await buildingReportsServices.findBuildingMaintenancesHistory({
      companyId: req.Company.id,
      queryFilter,
    });

  const folderName = `Folder-${Date.now()}`;
  fs.mkdirSync(folderName);
  const headerLogo = await downloadFromS3(company!.image, folderName);

  const maintenances: IMaintenancesData[] = [];
  const counts = {
    completed: 0,
    pending: 0,
    expired: 0,
    totalCost: 0,
  };

  maintenancesHistory.forEach((maintenance) => {
    if (
      maintenance.MaintenanceReport.length > 0 &&
      maintenance.MaintenanceReport[0].cost !== null
    ) {
      counts.totalCost += maintenance.MaintenanceReport[0].cost;
    }

    switch (maintenance.MaintenancesStatus.name) {
      case 'completed':
        counts.completed += 1;
        break;

      case 'overdue':
        counts.completed += 1;
        break;

      case 'pending':
        counts.pending += 1;
        break;

      case 'expired':
        counts.expired += 1;
        break;

      default:
        break;
    }

    const hasReport = maintenance.MaintenanceReport.length > 0;

    maintenances.push({
      id: maintenance.id,

      maintenanceHistoryId: maintenance.id,
      buildingName: maintenance.Building.name,
      categoryName: maintenance.Maintenance.Category.name,
      element: maintenance.Maintenance.element,
      activity: maintenance.Maintenance.activity,
      responsible: maintenance.Maintenance.responsible,
      source: maintenance.Maintenance.source,
      notificationDate: maintenance.notificationDate,
      maintenanceObservation: maintenance.Maintenance.observation,
      resolutionDate: maintenance.resolutionDate,
      status: maintenance.MaintenancesStatus.name,
      type: maintenance.Maintenance.MaintenanceType?.name ?? null,
      inProgress: maintenance.inProgress,

      cost: hasReport ? maintenance.MaintenanceReport[0].cost : null,

      reportObservation: hasReport ? maintenance.MaintenanceReport[0].observation : null,

      images: hasReport ? maintenance.MaintenanceReport[0].ReportImages : [],
      annexes: hasReport ? maintenance.MaintenanceReport[0].ReportAnnexes : [],
    });
  });

  const maintenancesForPDF = separateByMonth(maintenances);

  const bucketUrl = 'https://larguei.s3.us-west-2.amazonaws.com/';

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
          [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
          [
            { text: counts.completed, color: '#34B53A', bold: true, marginLeft: 16, fontSize: 12 },
            { text: counts.pending, color: '#FFB200', bold: true, fontSize: 12 },
            { text: counts.expired, color: '#FF3508', bold: true, fontSize: 12 },
            {
              text: `TOTAL: ${mask({ type: 'BRL', value: String(counts.totalCost) })}`,
              alignment: 'right',
              bold: true,
              marginRight: 16,
            },
          ],
          [
            {
              text: counts.completed > 1 ? 'Concluídas' : 'Concluída',
              color: '#999999',
              bold: true,
              marginLeft: 16,
            },
            {
              text: counts.pending > 1 ? 'Pendentes' : 'Pendente',
              color: '#999999',
              bold: true,
            },
            {
              text: counts.expired > 1 ? 'Vencidas' : 'Vencida',
              color: '#999999',
              bold: true,
            },
            { text: '' },
          ],
          [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        ],
      },
      layout: 'noBorders',
      marginTop: 24,
      marginLeft: 40,
      unbreakable: true,
      fillColor: '#E6E6E6',
    },
  ];

  for (let i = 0; i < maintenancesForPDF.length; i++) {
    const { data, month } = maintenancesForPDF[i];

    contentData.push({ text: month, fontSize: 16, marginTop: i > 0 ? 16 : 0, marginBottom: 8 });

    for (let j = 0; j < data.length; j++) {
      const {
        notificationDate,
        resolutionDate,
        inProgress,
        annexes,
        activity,
        categoryName,
        cost,
        element,
        images,
        reportObservation,
        responsible,
        status,
        type,
      } = data[j];

      if (j >= 1) {
        contentData.push({ text: ' ' });
      }

      const annexesForPDF: Content = [];

      annexes.forEach(({ name: annexName, url }, index) => {
        annexesForPDF.push({
          text: `${annexName}${annexes.length === index + 1 ? '.' : ', '}`,
          link: url,
        });
      });

      const imagesForPDF: Content = [];

      for (let imageIndex = 0; imageIndex < Math.min(images.length, 4); imageIndex++) {
        const { url } = images[imageIndex];

        const downloadedImage = await downloadFromS3(url, folderName);

        imagesForPDF.push([
          {
            image: path.join(folderName, downloadedImage),
            width: 50,
            height: 50,
            link: url,
          },
          { text: ' ' },
        ]);
      }

      const tags: Content = [];

      if (status === 'overdue') {
        tags.push({
          text: `  ${getSingularStatusNameforPdf('completed')}  `,
          background: getStatusBackgroundColor('completed'),
          color: '#FFFFFF',
          marginRight: 12,
        });
      }

      tags.push({
        text: `  ${getSingularStatusNameforPdf(status)}  `,
        background: getStatusBackgroundColor(status),
        color: '#FFFFFF',
        marginRight: 12,
      });

      if (type === 'occasional') {
        tags.push({
          text: `  Avulsa  `,
          background: getStatusBackgroundColor('occasional'),
          color: '#FFFFFF',
          marginRight: 12,
        });
      }

      if (inProgress) {
        tags.push({
          text: `  Em execução  `,
          background: getStatusBackgroundColor('inProgress'),
          color: '#FFFFFF',
          marginRight: 12,
        });
      }

      contentData.push({
        columns: [
          {
            stack: [
              String(notificationDate.getDate()).padStart(2, '0'),
              capitalizeFirstLetter(
                new Date(notificationDate)
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
              widths: [1, '*', '*', '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                    opacity: 1,
                  },
                  {
                    table: {
                      body: [tags],
                    },
                    layout: 'noBorders',
                    marginLeft: 13,
                    marginTop: 8,
                  },
                  { text: '' },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  { text: '' },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    text: [{ text: 'Categoria: ', bold: true }, { text: categoryName }],
                    marginLeft: 8,
                  },
                  {
                    text: [
                      { text: 'Notificação: ', bold: true },
                      { text: dateFormatter(notificationDate) },
                    ],
                  },
                  {
                    text: `Imagens (${images.length || 0}): `,
                    bold: true,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    text: [{ text: 'Elemento: ', bold: true }, { text: element }],
                    marginLeft: 8,
                  },
                  {
                    text: [
                      { text: 'Conclusão: ', bold: true },
                      { text: resolutionDate ? dateFormatter(resolutionDate) : '-' },
                    ],
                  },
                  {
                    columns: images,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    text: [{ text: 'Atividade: ', bold: true }, { text: activity }],
                    marginLeft: 8,
                  },
                  {
                    text: [{ text: 'Responsável: ', bold: true }, { text: responsible }],
                  },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  {
                    text: [
                      { text: 'Valor: ', bold: true },
                      {
                        text: mask({
                          type: 'BRL',
                          value: String(cost || 0),
                        }),
                      },
                    ],
                  },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  {
                    text: [
                      {
                        text: `Anexos (${annexes.length || 0}): `,
                        bold: true,
                      },
                      {
                        text: annexes,
                      },
                    ],
                  },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  { text: '' },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  { text: '' },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    text: [
                      { text: 'Observação do relato: ', bold: true },
                      { text: reportObservation || '-' },
                    ],
                    marginLeft: 8,
                  },
                  { text: '' },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  { text: '' },
                  { text: '' },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                  { text: '' },
                  { text: '' },
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

  const footerLogo = await downloadFromS3(
    'https://larguei.s3.us-west-2.amazonaws.com/LOGOPDF-1716384513443.png',
    folderName,
  );

  contentData.push(countData);

  const docDefinitions: TDocumentDefinitions = {
    pageOrientation: 'landscape',
    defaultStyle: { font: 'Arial', lineHeight: 1.1, fontSize: 10 },
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
            height: 60,
            link: company?.image || '',
          },
          { text: ' ', width: 8 },
          [
            {
              text: [
                { text: 'Edificação:', bold: true },
                { text: ' ' },
                { text: query.buildingNames },
              ],
              fontSize: 12,
            },
            {
              text: [
                { text: 'Categoria:', bold: true },
                { text: ' ' },
                { text: query.categoryNames },
              ],
              fontSize: 12,
            },
            {
              text: [
                { text: 'Status:', bold: true },
                { text: ' ' },
                {
                  text: query.maintenanceStatusNames
                    .split(',')
                    .map(
                      (value: string, i: number) =>
                        `${getSingularStatusNameforPdf(value)}${
                          query.maintenanceStatusNames.split(',').length === i + 1 ? '' : ','
                        }`,
                    ),
                },
              ],
              fontSize: 12,
            },
            {
              text: [
                { text: 'Período:', bold: true },
                { text: ' ' },
                {
                  text: `${dateFormatter(
                    setToUTCMidnight(new Date(req.query.startDate as string)),
                  )} a ${dateFormatter(setToUTCMidnight(new Date(req.query.endDate as string)))}`,
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
                  text: uuidv4().substring(0, 10),
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

  const filename = `${simplifyNameForURL(`Relatorio_Manutenções_${Date.now()}`)}.pdf`;

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

  const pdfLink = bucketUrl + filename;

  return res.status(200).json({ pdfLink });
}
