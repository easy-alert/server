import { checkNaN } from '../newValidator';

export function handleQueryPage(page: string | undefined) {
  checkNaN([{ label: 'Página', number: page }]);

  return Math.abs(Number(page) || 1);
}
