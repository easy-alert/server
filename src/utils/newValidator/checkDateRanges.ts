import { ServerMessage } from '../messages/serverMessage';

interface ICheckDateRanges {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  label: string;
  allowEquals?: boolean;
}

export function checkDateRanges(data: ICheckDateRanges[]) {
  data.forEach(({ startDate, endDate, label, allowEquals = true }) => {
    if (!allowEquals && startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw new ServerMessage({
        statusCode: 400,
        message: `A ${label} inicial deve ser menor que a ${label} final.`,
      });
    }

    if (allowEquals && startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ServerMessage({
        statusCode: 400,
        message: `A ${label} inicial deve ser menor ou igual a ${label} final.`,
      });
    }
  });
}
