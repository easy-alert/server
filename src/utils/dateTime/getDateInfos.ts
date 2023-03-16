import { addZeroInNumberFront } from './addZeroInNumberFront';

export const getDateInfos = (date: Date) => {
  let infos = {
    dayNumber: '',
    name: '',
    smName: '',
    year: 0,
  };

  switch (date.getDay()) {
    case 0:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Domingo',
        smName: 'Dom',
        year: date.getFullYear(),
      };
      break;

    case 1:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Segunda',
        smName: 'Seg',
        year: date.getFullYear(),
      };
      break;

    case 2:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Terça',
        smName: 'Ter',
        year: date.getFullYear(),
      };
      break;

    case 3:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Quarta',
        smName: 'Qua',
        year: date.getFullYear(),
      };
      break;

    case 4:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Quinta',
        smName: 'Qui',
        year: date.getFullYear(),
      };
      break;

    case 5:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Sexta',
        smName: 'Sex',
        year: date.getFullYear(),
      };
      break;

    case 6:
      infos = {
        dayNumber: addZeroInNumberFront(date.getDate()),
        name: 'Sábado',
        smName: 'Sáb',
        year: date.getFullYear(),
      };
      break;

    default:
      break;
  }

  return infos;
};
