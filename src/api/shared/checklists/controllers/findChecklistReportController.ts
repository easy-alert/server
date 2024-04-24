import { Response, Request } from 'express';
import { ChecklistStatusName } from '@prisma/client';
import { checklistServices } from '../services/checklistServices';
import {
  formatMonthYear,
  setToUTCLastMinuteOfDay,
  setToUTCMidnight,
} from '../../../../utils/dateTime';
import { checkDateRanges, checkValues } from '../../../../utils/newValidator';

export interface IParsedFilters {
  buildingNames?: string[];
  statusNames?: ChecklistStatusName[];
  startDate: string;
  endDate: string;
}

interface IName {
  name: string;
}
interface IImage {
  name: string;
  url: string;
}

interface ISeparateByMonth {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  building: IName;
  syndic: IName;
  frequency: number | null;
  status: ChecklistStatusName;
  observation: string | null;
  images: IImage[];
}

function separateByMonth(array: ISeparateByMonth[]) {
  const separatedByMonth: { [key: string]: ISeparateByMonth[] } = {};

  array.forEach((data) => {
    const monthYear = `${data.date.getMonth() + 1}-${data.date.getFullYear()}`;

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

export async function findChecklistReportController(req: Request, res: Response) {
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

  await checklistServices.checkAccessByCompany({ companyId });

  const checklists = await checklistServices.findManyForReport({
    ...parsedFilters,
    companyId,
    startDate: setToUTCMidnight(new Date(parsedFilters.startDate)),
    endDate: setToUTCLastMinuteOfDay(new Date(parsedFilters.endDate)),
  });

  const completedCount = checklists.filter((e) => e.status === 'completed').length;
  const pendingCount = checklists.filter((e) => e.status === 'pending').length;

  const checklistsForPDF = separateByMonth(checklists);

  return res.status(200).json({ checklists, completedCount, pendingCount, checklistsForPDF });
}
