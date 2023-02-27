import { addZeroInNumberFront } from './addZeroInNumberFront';

export const getDateInfos = (date: Date) => {
  let infos = { dayNumber: '', name: '', smName: '', year: 0 };

  switch (date.getUTCDay()) {
    case 0:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Domingo',
        smName: 'Dom',
        year: date.getFullYear(),
      };
      break;

    case 1:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Segunda',
        smName: 'Seg',
        year: date.getFullYear(),
      };
      break;

    case 2:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Terça',
        smName: 'Ter',
        year: date.getFullYear(),
      };
      break;

    case 3:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Quarta',
        smName: 'Qua',
        year: date.getFullYear(),
      };
      break;

    case 4:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Quinta',
        smName: 'Qui',
        year: date.getFullYear(),
      };
      break;

    case 5:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Sexta',
        smName: 'Sex',
        year: date.getFullYear(),
      };
      break;

    case 6:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Sabado',
        smName: 'Sab',
        year: date.getFullYear(),
      };
      break;

    default:
      break;
  }

  return infos;
};
