import { Request, Response } from 'express';
import { prisma } from '../../../prisma';

import { defaultMaintenanceTemplateServices } from '../../api/shared/defaultMaintenanceTemplates/services/defaultMaintenanceTemplateServices';
import { Validator } from '../validator/validator';

const validator = new Validator();

async function findByIdBuildingForTemplate(id: string) {
  const building = await prisma.building.findFirst({
    select: {
      Categories: {
        include: {
          Maintenances: true,
        },
      },
    },

    where: {
      id,
    },
  });

  return building;
}

export async function createDefaultTemplates(req: Request, res: Response) {
  const { buildingId, templateName } = req.body;

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
    {
      label: 'Nome do template',
      type: 'string',
      variable: templateName,
    },
  ]);

  const building = await findByIdBuildingForTemplate(buildingId);

  const template = await defaultMaintenanceTemplateServices.findTemplateByName({
    name: templateName,
  });

  if (template) {
    return res.status(400).json({
      message: 'Já existe um template com esse nome cadastrado.',
    });
  }

  if (!building) {
    return res.status(404).json({
      message: 'Edificação não encontrada.',
    });
  }

  const defaultMaintenanceTemplate = await defaultMaintenanceTemplateServices.createTemplate({
    name: templateName,
  });

  for (let i = 0; i < building.Categories.length; i++) {
    const category = await defaultMaintenanceTemplateServices.createCategory({
      defaultMaintenanceTemplateId: defaultMaintenanceTemplate.id,
      categoryId: building.Categories[i].categoryId,
    });

    for (let j = 0; j < building.Categories[i].Maintenances.length; j++) {
      await defaultMaintenanceTemplateServices.createMaintenance({
        defaultTemplateCategoryId: category.id,
        maintenanceId: building.Categories[i].Maintenances[j].maintenanceId,
      });
    }
  }

  return res.status(200).json({
    message: 'Template criado com sucesso.',
  });
}
