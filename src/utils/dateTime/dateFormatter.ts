export const dateFormatter = (date?: string | Date) => {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  return date.toLocaleDateString('pt-BR');
};
