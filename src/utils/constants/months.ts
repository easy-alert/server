type Month = {
  number: number;
  name: string;
};

const getMonths = (language?: string): Month[] => {
  const months: { [key: string]: string[] } = {
    ptBr: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],

    enUs: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],

    es: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    // Add more languages here
  };

  return months[language || 'ptBr'].map((month, index) => ({
    number: index + 1,
    name: month,
  }));
};

export default getMonths;
