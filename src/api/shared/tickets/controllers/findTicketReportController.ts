import { Response, Request } from 'express';
import { TicketStatusName } from '@prisma/client';
import {
  formatMonthYear,
  setToUTCLastMinuteOfDay,
  setToUTCMidnight,
} from '../../../../utils/dateTime';
import { checkDateRanges, checkValues } from '../../../../utils/newValidator';
import { ticketServices } from '../services/ticketServices';

export interface IParsedFilters {
  buildingNames?: string[];
  statusNames?: TicketStatusName[];
  startDate: string;
  endDate: string;
}

interface Building {
  name: string;
}

interface Image {
  name: string;
  url: string;
}

interface Place {
  label: string;
}
interface Type {
  type: Place;
}

interface Status {
  name: TicketStatusName;
  label: string;
  color: string;
  backgroundColor: string;
}

interface ISeparateByMonth {
  id: string;
  building: Building;
  description: string;
  images: Image[];
  place: Place;
  types: Type[];
  status: Status;
  createdAt: Date;
  residentName: string;
  residentApartment: string;
}

// function separateByMonth(array: ISeparateByMonth[]) {
//   const separatedByMonth: { [key: string]: ISeparateByMonth[] } = {};

//   array.forEach((data) => {
//     const monthYear = `${data.createdAt.getMonth() + 1}-${data.createdAt.getFullYear()}`;

//     if (!separatedByMonth[monthYear]) {
//       separatedByMonth[monthYear] = [];
//     }

//     separatedByMonth[monthYear].push(data);
//   });

//   const result = Object.keys(separatedByMonth).map((key) => ({
//     month: formatMonthYear(key),
//     data: separatedByMonth[key],
//   }));

//   return result;
// }

export async function findTicketReportController(req: Request, res: Response) {
  const companyId = req.Company.id;
  const { filters } = req.query as any as { filters: string };

  const parsedFilters = JSON.parse(filters) as IParsedFilters;

  checkValues([
    { label: 'Data inicial', type: 'date', value: parsedFilters.startDate },
    { label: 'Data final', type: 'date', value: parsedFilters.endDate },
    { label: 'Edificações', type: 'array', value: parsedFilters.buildingNames, required: false },
    { label: 'Status', type: 'array', value: parsedFilters.statusNames, required: false },
  ]);

  checkDateRanges([
    { endDate: parsedFilters.endDate, startDate: parsedFilters.startDate, label: 'Datas' },
  ]);

  await ticketServices.checkAccessByCompany({ companyId });

  const tickets = await ticketServices.findManyForReport({
    ...parsedFilters,
    companyId,
    startDate: setToUTCMidnight(new Date(parsedFilters.startDate)),
    endDate: setToUTCLastMinuteOfDay(new Date(parsedFilters.endDate)),
  });

  console.log('🚀 ~ findTicketReportController ~ tickets:', tickets);

  const openCount = tickets.filter((e) => e.status.name === 'open').length;
  const finishedCount = tickets.filter((e) => e.status.name === 'finished').length;
  const awaitingToFinishCount = tickets.filter((e) => e.status.name === 'awaitingToFinish').length;

  // const ticketsForPDF = separateByMonth(tickets);

  const ticketsForPDF = {
    month: 'Junho 2021',
    data: [],
  };

  return res
    .status(200)
    .json({ tickets, ticketsForPDF, openCount, finishedCount, awaitingToFinishCount });
}
