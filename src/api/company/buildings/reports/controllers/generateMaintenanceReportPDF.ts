/* eslint-disable no-shadow */
/* eslint-disable no-loop-func */
// #region IMPORTS
import PDFPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Request, Response } from 'express';

import { prisma } from '../../../../../../prisma';

import { BuildingReportsServices } from '../services/buildingReportsServices';
import { buildingServices } from '../../building/services/buildingServices';

import { sendErrorToServerLog } from '../../../../../utils/messages/sendErrorToServerLog';
import { SharedCalendarServices } from '../../../../shared/calendar/services/SharedCalendarServices';
import { dateTimeFormatter } from '../../../../../utils/dateTime/dateTimeFormatter';
import { processImagesForPDF } from '../../../../../utils/processors/pdfImageProcessor';
import { downloadFromS3 } from '../../../../../utils/aws/downloadFromS3';
import { uploadPDFToS3 } from '../../../../../utils/aws/uploadPDFToS3';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { ensurePdfCompatibleImage } from '../../../../../utils/sharp/imageFormatConverter';
import { mask, simplifyNameForURL } from '../../../../../utils/dataHandler';
import { formattedDownloadFromS3 } from '../../../../../utils/aws/formattedDownloadFromS3';
import {
  dateFormatter,
  setToUTCLastMinuteOfDay,
  setToUTCMidnight,
} from '../../../../../utils/dateTime';

import type { IInterval } from './listForBuildingReports';
import type { IMaintenancesData, IQuery, IQueryFilter } from '../services/types';

// CLASS
const buildingReportsServices = new BuildingReportsServices();
const sharedCalendarServices = new SharedCalendarServices();

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
    common: '#087EB4', // theme.color.common
  };

  return backgroundColor[status];
};

const getSingularStatusNameForPdf = (status: string) => {
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

const handleFilterByName = (filterBy: string) => {
  switch (filterBy) {
    case 'notificationDate':
      return 'Período de notificação';
    case 'dueDate':
      return 'Período de vencimento';
    case 'allActivities':
      return 'Todas as atividades';
    default:
      return 'Período de notificação';
  }
};

async function PDFService({
  company,
  id,
  query,
  maintenancesHistory,
  req,
  MaintenancesPending,
  queryFilter,
}: {
  req: Request;
  company: { image: string } | null;
  id: string;
  maintenancesHistory: any;
  MaintenancesPending: any;
  query: IQuery;
  queryFilter: IQueryFilter;
}) {
  const pdfId = uuidv4().substring(0, 10);
  const folderName = `Folder-${Date.now()}`;

  try {
    fs.mkdirSync(folderName);

    const isDicebear = company?.image.includes('dicebear');

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
        url: company?.image!,
        folderName,
        targetFormat: 'png',
      });
      headerLogoPath = await ensurePdfCompatibleImage(headerLogoPathRaw);
    }

    const footerLogoPathRaw = path.join(folderName, footerLogoFile);
    const footerLogoPath = await ensurePdfCompatibleImage(footerLogoPathRaw);

    const showMaintenancePriority = await prisma.company.findUnique({
      where: { id: req.companyId },
      select: { showMaintenancePriority: true },
    });

    let maintenances: IMaintenancesData[] = [];

    for (let i = 0; i < MaintenancesPending.length; i++) {
      if (MaintenancesPending[i].Maintenance?.MaintenanceType?.name === 'occasional') {
        const hasReport = MaintenancesPending[i].MaintenanceReport.length > 0;

        maintenances.push({
          id: MaintenancesPending[i].id,
          dueDate: MaintenancesPending[i].dueDate,
          maintenanceHistoryId: MaintenancesPending[i].id,
          buildingName: MaintenancesPending[i].Building.name,
          categoryName: MaintenancesPending[i].Maintenance.Category.name,
          element: MaintenancesPending[i].Maintenance.element,
          activity: MaintenancesPending[i].Maintenance.activity,
          responsible: MaintenancesPending[i].Maintenance.responsible,
          source: MaintenancesPending[i].Maintenance.source,
          notificationDate: MaintenancesPending[i].notificationDate,
          maintenanceObservation: MaintenancesPending[i].Maintenance.observation,
          resolutionDate: MaintenancesPending[i].resolutionDate,
          status: MaintenancesPending[i].MaintenancesStatus.name,
          type: MaintenancesPending[i].Maintenance.MaintenanceType?.name ?? null,
          inProgress: MaintenancesPending[i].inProgress,
          serviceOrderNumber: MaintenancesPending[i].serviceOrderNumber ?? null,
          priority: MaintenancesPending[i].priority,

          activities:
            MaintenancesPending[i].activities.filter(
              (activity: any) => activity.type === 'comment',
            ) ?? [],

          cost: hasReport ? MaintenancesPending[i].MaintenanceReport[0].cost : null,

          reportObservation: hasReport
            ? MaintenancesPending[i].MaintenanceReport[0].observation
            : null,

          images: hasReport ? MaintenancesPending[i].MaintenanceReport[0].ReportImages : [],
          annexes: hasReport ? MaintenancesPending[i].MaintenanceReport[0].ReportAnnexes : [],
        });
      } else {
        const foundBuildingMaintenance =
          await buildingServices.findBuildingMaintenanceDaysToAnticipate({
            buildingId: MaintenancesPending[i].Building.id,
            maintenanceId: MaintenancesPending[i].Maintenance.id,
          });

        const intervals = sharedCalendarServices.recurringDates({
          startDate: MaintenancesPending[i].notificationDate,
          endDate: setToUTCLastMinuteOfDay(queryFilter.dateFilter.lte),
          interval:
            MaintenancesPending[i].Maintenance.frequency *
              MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime -
            (foundBuildingMaintenance?.daysToAnticipate ?? 0),
          maintenanceData: MaintenancesPending[i],
          periodDaysInterval:
            MaintenancesPending[i].Maintenance.period *
              MaintenancesPending[i].Maintenance.PeriodTimeInterval.unitTime +
            (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        });

        const intervalsTyped: IInterval[] = intervals;

        intervalsTyped.forEach(
          ({
            Building,
            Maintenance,
            MaintenanceReport,
            MaintenancesStatus,
            expectedDueDate,
            expectedNotificationDate,
            id,
            inProgress,
            // notificationDate,
            resolutionDate,
            isFuture,
          }) => {
            const hasReport = MaintenanceReport.length > 0;

            maintenances.push({
              id: Maintenance.id,
              expectedDueDate,
              dueDate: expectedDueDate,
              expectedNotificationDate,
              isFuture,
              maintenanceHistoryId: id,
              buildingName: Building.name,
              categoryName: Maintenance.Category.name,
              element: Maintenance.element,
              activity: Maintenance.activity,
              responsible: Maintenance.responsible,
              source: Maintenance.source,
              // PRO SORT
              notificationDate: expectedNotificationDate,
              maintenanceObservation: Maintenance.observation,
              resolutionDate,
              status: MaintenancesStatus.name,
              type: Maintenance.MaintenanceType?.name ?? null,
              inProgress,
              serviceOrderNumber: MaintenancesPending[i].serviceOrderNumber ?? null,
              priority: MaintenancesPending[i].priority,

              activities:
                MaintenancesPending[i].activities.filter(
                  (activity: any) => activity.type === 'comment',
                ) ?? [],

              cost: hasReport ? MaintenanceReport[0].cost : null,

              reportObservation: hasReport ? MaintenanceReport[0].observation : null,

              images: hasReport ? MaintenanceReport[0].ReportImages : [],
              annexes: hasReport ? MaintenanceReport[0].ReportAnnexes : [],
            });
          },
        );
      }
    }

    maintenances = maintenances.filter(
      (data: any) =>
        data[queryFilter.filterBy] >= queryFilter.dateFilter.gte &&
        data[queryFilter.filterBy] <= queryFilter.dateFilter.lte,
    );

    const counts = {
      completed: 0,
      // Nesse momento só tem as pendentes
      pending: maintenances.length,
      expired: 0,
      totalCost: 0,
    };

    maintenancesHistory.forEach((maintenance: any) => {
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

        dueDate: maintenance.dueDate,
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
        serviceOrderNumber: maintenance.serviceOrderNumber ?? null,
        priority: maintenance.priority,

        activities:
          maintenance.activities.filter((activity: any) => activity.type === 'comment') ?? [],

        cost: hasReport ? maintenance.MaintenanceReport[0].cost : null,

        reportObservation: hasReport ? maintenance.MaintenanceReport[0].observation : null,

        images: hasReport ? maintenance.MaintenanceReport[0].ReportImages : [],
        annexes: hasReport ? maintenance.MaintenanceReport[0].ReportAnnexes : [],
      });
    });

    maintenances.sort((a, b) => b.notificationDate.getTime() - a.notificationDate.getTime());

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
            [
              {
                text: counts.completed,
                color: '#34B53A',
                bold: true,
                marginLeft: 16,
                fontSize: 12,
              },
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
          ],
        },
        layout: 'noBorders',
        fillColor: '#E6E6E6',
        unbreakable: false,
        marginBottom: 10,
      },
    ];

    contentData.push(countData);

    for (let i = 0; i < maintenancesForPDF.length; i++) {
      const { data, month } = maintenancesForPDF[i];

      contentData.push({ text: month, fontSize: 14, marginTop: i > 0 ? 8 : 0, marginBottom: 4 });

      for (let j = 0; j < data.length; j++) {
        const {
          notificationDate,
          resolutionDate,
          inProgress,
          annexes,
          activity,
          activities,
          categoryName,
          cost,
          element,
          images,
          // reportObservation,
          responsible,
          status,
          type,
          buildingName,
          priority,
          serviceOrderNumber,
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

        // Process images for PDF using shared utility
        const { imagesForPDF, skippedImages } = await processImagesForPDF({
          images: images || [],
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

        // const activitiesImagesForPDF: Content = [];

        // activities?.forEach(({ images }) => {
        //   images?.forEach(({ name, url }, index) => {
        //     activitiesImagesForPDF.push({
        //       text: name ?? `Imagem-${index + 1}.jpeg`,
        //       link: url,
        //     });
        //   });
        // });

        const tags: Content = [];

        tags.push({
          text: buildingName,
          marginRight: 12,
          fontSize: 12,
          bold: true,
          noWrap: true,
        });

        if (status === 'overdue') {
          tags.push({
            text: `  ${getSingularStatusNameForPdf('completed')}  `,
            background: getStatusBackgroundColor('completed'),
            color: '#FFFFFF',
            marginRight: 12,
            noWrap: true,
          });
        }

        tags.push({
          text: `  ${getSingularStatusNameForPdf(status)}  `,
          background: getStatusBackgroundColor(status),
          color: '#FFFFFF',
          marginRight: 12,
          noWrap: true,
        });

        if (type === 'occasional') {
          tags.push({
            text: `  Avulsa  `,
            background: getStatusBackgroundColor('occasional'),
            color: '#FFFFFF',
            marginRight: 12,
            noWrap: true,
          });
        } else {
          tags.push({
            text: `  Preventiva  `,
            background: getStatusBackgroundColor('common'),
            color: '#FFFFFF',
            marginRight: 12,
            noWrap: true,
          });
        }

        if (inProgress) {
          tags.push({
            text: `  Em execução  `,
            background: getStatusBackgroundColor('inProgress'),
            color: '#FFFFFF',
            marginRight: 12,
            noWrap: true,
          });
        }

        if (showMaintenancePriority && priority && priority.label) {
          tags.push({
            text: `  ${priority.label}  `,
            background: priority.backgroundColor,
            color: priority.color,
            marginRight: 12,
            noWrap: true,
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
              stack: [
                {
                  table: {
                    widths: [1, '*', 'auto'],
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
                          text: '',
                        },
                        {
                          text: `#${serviceOrderNumber}`,
                          fontSize: 8,
                          // background: '#808080',
                          // color: '#FFFFFF',
                          color: '#000000',
                          marginRight: 12,
                          noWrap: true,
                          alignment: 'right',
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
                    widths: [1, '*', 200, '*'],
                    body: [
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
                          text: [{ text: 'Responsável: ', bold: true }, { text: responsible }],
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
                          fillColor: getStatusBackgroundColor(
                            status === 'overdue' ? 'completed' : status,
                          ),
                        },
                        {
                          text: [{ text: 'Atividade: ', bold: true }, { text: activity }],
                          marginLeft: 8,
                        },
                      ],
                      [
                        {
                          text: '',
                          fillColor: getStatusBackgroundColor(
                            status === 'overdue' ? 'completed' : status,
                          ),
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
          unbreakable: false,
        });

        const lastContent = contentData.length - 1;

        if (activities && activities.length > 0) {
          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    table: {
                      // widths: ['auto', 200, '*', 200],
                      widths: [90, 200, '*'],
                      body: [
                        [
                          { text: 'Data', bold: true },
                          { text: 'Atividade', bold: true },
                          { text: 'Descrição', bold: true },
                          // { text: 'Anexos', bold: true },
                        ],
                        ...(activities ?? []).map(({ title, content, createdAt }) => [
                          { text: dateTimeFormatter(createdAt) },
                          { text: title },
                          { text: content },
                          // {
                          //   stack: annexes?.map(({ name, url }) => [
                          //     {
                          //       text: name,
                          //       link: url,
                          //     },
                          //   ]),
                          // },
                        ]),
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
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                ],
              ],
            },
            layout: 'noBorders',
            fillColor: '#E6E6E6',
          });
        }

        if (annexesForPDF && annexesForPDF.length > 0) {
          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    text: [{ text: `Anexos (${annexes.length || 0}): `, bold: true }],
                    marginLeft: 8,
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
                    stack: annexesForPDF,
                    marginLeft: 8,
                  },
                ],
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  { text: '' },
                ],
              ],
            },
            layout: 'noBorders',
            fillColor: '#E6E6E6',
          });
        }

        // Only add image section if there are valid images
        if (validImagesForPDF && validImagesForPDF.length > 0) {
          const imagesRows = Math.ceil(validImagesForPDF.length / 6);

          (contentData[lastContent] as any).columns[1].stack.push({
            table: {
              widths: [1, '*'],
              body: [
                [
                  {
                    text: '',
                    fillColor: getStatusBackgroundColor(
                      status === 'overdue' ? 'completed' : status,
                    ),
                  },
                  {
                    text: [{ text: `Imagens (${validImagesForPDF.length}): `, bold: true }],
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
                      fillColor: getStatusBackgroundColor(
                        status === 'overdue' ? 'completed' : status,
                      ),
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
                      fillColor: getStatusBackgroundColor(
                        status === 'overdue' ? 'completed' : status,
                      ),
                    },
                    { text: '' },
                  ],
                ],
              },
              layout: 'noBorders',
              fillColor: '#E6E6E6',
            });
          }
        } else if (images && images.length > 0) {
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
              text: 'Relatório de Manutenções',
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
                  absolutePosition: { x: 64, y: 32 },
                },
                {
                  table: {
                    widths: ['*', 'auto'],
                    body: [
                      [
                        {
                          text: [
                            { text: 'Edificação: ', bold: true },
                            { text: query.buildingNames || 'Todas' },
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
                            { text: 'Categoria: ', bold: true },
                            { text: query.categoryNames || 'Todas' },
                          ],
                          fontSize: 12,
                          marginLeft: 8,
                        },
                        {
                          text: [
                            {
                              text: `${handleFilterByName(queryFilter.filterBy)}: `,
                              bold: true,
                            },
                            {
                              text: `${dateFormatter(
                                setToUTCMidnight(new Date(req.query.startDate as string)),
                              )} a ${dateFormatter(
                                setToUTCMidnight(new Date(req.query.endDate as string)),
                              )}`,
                            },
                          ],
                          fontSize: 12,
                          marginRight: 8,
                        },
                      ],
                      [
                        {
                          text: [
                            { text: 'Status: ', bold: true },
                            {
                              text:
                                (query.maintenanceStatusNames?.length || 0) > 0
                                  ? (query.maintenanceStatusNames || []).map(
                                      (value: string, i: number) =>
                                        `${getSingularStatusNameForPdf(value)}$${
                                          (query.maintenanceStatusNames?.length || 0) === i + 1
                                            ? ''
                                            : ','
                                        }`,
                                    )
                                  : 'Todos',
                            },
                          ],
                          fontSize: 12,
                          marginLeft: 8,
                        },
                        { text: '' },
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

      footer(currentPage: number, totalPages: number) {
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
                  text: [{ text: 'ID: ', bold: true }, { text: pdfId }],
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

    await prisma.maintenanceReportPdf.update({
      data: { url: pdfLink, status: 'finished' },
      where: { id },
    });
  } catch (error) {
    sendErrorToServerLog({ stack: error, extraInfo: 'Erro nas funções que o Augusto fez' });

    deleteFolder(folderName);
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.maintenanceReportPdf.update({
      data: { status: 'failed' },
      where: { id },
    });
  }
}

export async function generateMaintenanceReportPDF(req: Request, res: Response) {
  const { query } = req as any;

  const previousReport = await prisma.maintenanceReportPdf.findFirst({
    where: { authorId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  if (previousReport?.status === 'pending') {
    throw new ServerMessage({
      message: 'Aguarde o último relatório ser finalizado para gerar um novo.',
      statusCode: 400,
    });
  }

  const queryFilter = buildingReportsServices.mountQueryFilter({ query: req.query as any });

  const { maintenancesHistory, company, MaintenancesPending } =
    await buildingReportsServices.findBuildingMaintenancesHistory({
      companyId: req.Company.id,
      queryFilter,
    });

  let imageCount = 0;
  maintenancesHistory.forEach(({ MaintenanceReport }) => {
    MaintenanceReport.forEach(({ ReportImages }) => {
      imageCount += ReportImages.length;
    });
  });

  const imageLimit = 500;

  if (imageCount > imageLimit) {
    throw new ServerMessage({
      message: `Você selecionou manutenções contendo ${imageCount} imagens. O limite para o PDF é ${imageLimit} imagens.`,
      statusCode: 400,
    });
  }

  const { id } = await prisma.maintenanceReportPdf.create({
    data: {
      name: `${handleFilterByName(queryFilter.filterBy)} - ${dateFormatter(
        queryFilter.dateFilter.gte,
      )} a ${dateFormatter(queryFilter.dateFilter.lte)}`,
      authorId: req.userId,
      authorCompanyId: req.Company.id,
    },
  });

  PDFService({ company, id, query, maintenancesHistory, req, MaintenancesPending, queryFilter });

  return res.status(200).json({ ServerMessage: { message: 'Geração de PDF em andamento.' } });
}
