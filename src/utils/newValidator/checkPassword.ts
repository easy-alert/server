import { ServerMessage } from '../messages/serverMessage';

export function checkPassword({
  password,
  confirmPassword,
}: {
  password?: string;
  confirmPassword?: string;
}) {
  const passwordMinLength = 8;

  if (!password && !confirmPassword) return;

  if ((password && !confirmPassword) || (!password && confirmPassword)) {
    throw new ServerMessage({
      message: 'Envie a senha e a confirmação da senha.',
      statusCode: 400,
    });
  }

  if (password !== confirmPassword) {
    throw new ServerMessage({
      message: 'As senhas precisam ser iguais',
      statusCode: 400,
    });
  }

  if (password && password.length < passwordMinLength) {
    throw new ServerMessage({
      message: `A senha precisa ter pelo menos ${passwordMinLength} dígitos`,
      statusCode: 400,
    });
  }
}
