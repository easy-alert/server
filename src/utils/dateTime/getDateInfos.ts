import { addZeroInNumberFront } from './addZeroInNumberFront';

export const getDateInfos = (date: Date) => {
  let infos = { dayNumber: '', name: '', smName: '' };

  switch (date.getUTCDay()) {
    case 0:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Domingo',
        smName: 'Dom',
      };
      break;

    case 1:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Segunda',
        smName: 'Seg',
      };
      break;

    case 2:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Terça',
        smName: 'Ter',
      };
      break;

    case 3:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Quarta',
        smName: 'Qua',
      };
      break;

    case 4:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Quinta',
        smName: 'Qui',
      };
      break;

    case 5:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Sexta',
        smName: 'Sex',
      };
      break;

    case 6:
      infos = {
        dayNumber: addZeroInNumberFront(date.getUTCDate()),
        name: 'Sabado',
        smName: 'Sab',
      };
      break;

    default:
      break;
  }

  return infos;
};
