export const dateFormatter = (date?: string | Date, locale?: string) => {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString(locale || 'pt-BR');
  }

  return date.toLocaleDateString('pt-BR');
};
