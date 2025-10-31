import { Request, Response } from 'express';
import { completePreRegistrationService } from '../services/completePreRegistrationService';

function validate(data: any, rules: any) {
  for (const field in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, field)) {
      const value = data[field];
      const rule = rules[field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        throw new Error(`O campo '${rule.label}' é obrigatório.`);
      }
      if (rule.type && value !== undefined && value !== null && typeof value !== rule.type) {
        throw new Error(`O campo '${rule.label}' deve ser do tipo '${rule.type}'.`);
      }
      if (rule.min && typeof value === 'number' && value < rule.min) {
        throw new Error(`O campo '${rule.label}' deve ser no mínimo ${rule.min}.`);
      }
      if (rule.enum && value && !rule.enum.includes(value)) {
        throw new Error(`O valor para '${rule.label}' é inválido.`);
      }
    }
  }
}

export async function completePreRegistrationController(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const clientData = req.body;

    validate({ token }, { token: { required: true, type: 'string', label: 'Token' } });

    validate(clientData, {
      clientName: { required: true, type: 'string', label: 'Nome da Empresa' },
      cnpj: { required: false, type: 'string', label: 'CNPJ' },
      cpf: { required: false, type: 'string', label: 'CPF' },
      loginEmail: { required: true, type: 'string', label: 'E-mail' },
      password: { required: true, type: 'string', label: 'Senha' },
      contactPhone: { required: true, type: 'string', label: 'Telefone' },
    });

    const normalizedCNPJ = clientData.cnpj
      ? String(clientData.cnpj).replace(/[^\d]/g, '')
      : undefined;
    const normalizedCPF = clientData.cpf ? String(clientData.cpf).replace(/[^\d]/g, '') : undefined;

    if (!normalizedCNPJ && !normalizedCPF) {
      throw new Error("O campo 'CNPJ' ou 'CPF' é obrigatório.");
    }

    if (normalizedCNPJ && normalizedCNPJ.length !== 14) {
      throw new Error('CNPJ inválido.');
    }
    if (normalizedCPF && normalizedCPF.length !== 11) {
      throw new Error('CPF inválido.');
    }

    clientData.cnpj = normalizedCNPJ;
    clientData.cpf = normalizedCPF;

    await completePreRegistrationService(token, clientData);

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Cadastro finalizado com sucesso!',
      },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('inválido, expirado ou já utilizado') ? 404 : 400;

    return res.status(statusCode).json({
      ServerMessage: {
        statusCode,
        message: error.message || 'Erro ao finalizar o cadastro.',
      },
    });
  }
}
