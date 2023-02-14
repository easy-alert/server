import { getMonthDay } from './getMonthDay';

export const getDateInfos = (date: Date) => {
  let infos = { dayNumber: 0, name: '', smName: '' };

  switch (date.getDay()) {
    case 0:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Domingo',
        smName: 'Dom',
      };
      break;

    case 1:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Segunda',
        smName: 'Seg',
      };
      break;

    case 2:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Terça',
        smName: 'Ter',
      };
      break;

    case 3:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Quarta',
        smName: 'Qua',
      };
      break;

    case 4:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Quinta',
        smName: 'Qui',
      };
      break;

    case 5:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Sexta',
        smName: 'Sex',
      };
      break;

    case 6:
      infos = {
        dayNumber: getMonthDay(date),
        name: 'Sabado',
        smName: 'Sab',
      };
      break;

    default:
      break;
  }

  return infos;
};
