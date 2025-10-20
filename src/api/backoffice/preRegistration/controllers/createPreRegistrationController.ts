import { Request, Response } from 'express';
import { preRegistrationServices } from '../services/createPreRegistrationService';

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

export async function createPreRegistrationController(req: Request, res: Response) {
  try {
    const data = req.body;

    validate(data, {
      clientType: {
        required: true,
        enum: [
          'residentSyndic',
          'professionalSyndic',
          'constructionCompany',
          'administrationCompany',
          'others',
        ],
        label: 'Tipo de Cliente',
      },
      buildingQuantity: {
        required: true,
        type: 'number',
        min: 1,
        label: 'Quantidade de Condomínios',
      },
      planType: { required: true, enum: ['monthly', 'annual'], label: 'Tipo de Plano' },
      monthlyPrice: { required: true, type: 'number', min: 0.01, label: 'Valor Mensal' },
      implementationPrice: {
        required: true,
        type: 'number',
        min: 0.01,
        label: 'Valor de Implementação',
      },
    });

    const newPreRegistration = await preRegistrationServices.create(data);

    return res.status(201).json({
      token: newPreRegistration.id,
      ServerMessage: {
        statusCode: 201,
        message: 'Link de pré-cadastro gerado com sucesso.',
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: error.message || 'Erro ao processar a requisição.',
      },
    });
  }
}
