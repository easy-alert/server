export const dateTimeFormatter = (date?: string | Date) => {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    return new Date(date).toLocaleString('pt-BR').substring(0, 17);
  }

  return date.toLocaleString('pt-BR').substring(0, 17);
};
