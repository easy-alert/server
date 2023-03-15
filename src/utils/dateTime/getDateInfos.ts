import { addZeroInNumberFront } from './addZeroInNumberFront';

export const getDateInfos = (date: Date) => {
  let infos = {
    dayNumber: '',
    name: '',
    smName: '',
    year: 0,
  };

  switch (date.getUTCDay()) {
    case 0:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Domingo',
        smName: 'Dom',
        year: date.getUTCFullYear(),
      };
      break;

    case 1:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Segunda',
        smName: 'Seg',
        year: date.getUTCFullYear(),
      };
      break;

    case 2:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Terça',
        smName: 'Ter',
        year: date.getUTCFullYear(),
      };
      break;

    case 3:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Quarta',
        smName: 'Qua',
        year: date.getUTCFullYear(),
      };
      break;

    case 4:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Quinta',
        smName: 'Qui',
        year: date.getUTCFullYear(),
      };
      break;

    case 5:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Sexta',
        smName: 'Sex',
        year: date.getUTCFullYear(),
      };
      break;

    case 6:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Sábado',
        smName: 'Sáb',
        year: date.getUTCFullYear(),
      };
      break;

    default:
      break;
  }

  return infos;
};
