import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import type {
  Checklist,
  ChecklistItem,
  ChecklistStatusName,
  ChecklistTemplate,
  ChecklistTemplateItem,
} from '@prisma/client';

// import { checklistServices } from '../services/checklistServices';
import { getChecklistTemplateById } from '../services/getChecklistTemplateById';
import { createChecklist } from '../services/createChecklist';

import { checkValues } from '../../../../utils/newValidator';
import { addDays, setToUTCMidnight } from '../../../../utils/dateTime';

interface IBody {
  buildingId: string;
  checklistTemplateId?: string;
  editedChecklistTemplate?: ChecklistTemplate & { items: ChecklistTemplateItem[] };
  newChecklist?: Checklist & { items: ChecklistItem[] };
  responsibleId: string[];
  startDate: string;
  interval: string;
  status: ChecklistStatusName;
}

export async function createChecklistController(req: Request, res: Response) {
  const {
    buildingId,
    checklistTemplateId,
    editedChecklistTemplate,
    newChecklist,
    responsibleId,
    startDate,
    interval,
    status,
  }: IBody = req.body;

  const numberFrequency = Number(interval);

  checkValues([
    { label: 'Edificação', type: 'string', value: buildingId },
    { label: 'Usuários', type: 'array', value: responsibleId },
    { label: 'Status', type: 'string', value: status },
    { label: 'Data', type: 'date', value: startDate },
  ]);

  if (checklistTemplateId) {
    checkValues([{ label: 'ID do template', type: 'string', value: checklistTemplateId }]);

    const checklistTemplate = await getChecklistTemplateById({ checklistId: checklistTemplateId });

    if (!checklistTemplate) {
      return res.status(404).json({ ServerMessage: { message: 'Template não encontrado.' } });
    }

    if (numberFrequency) {
      const frequencyToCreate = Math.ceil((365 / numberFrequency) * 3);

      const childrenChecklists: Checklist[] = [];

      const groupId = uuidv4().replace(/-/g, '').substring(0, 12);

      for (let index = 0; index < frequencyToCreate; index++) {
        let setDate = setToUTCMidnight(new Date(startDate));

        if (index > 0) {
          setDate = addDays({
            date: setToUTCMidnight(new Date(startDate)),
            days: numberFrequency * index,
          });
        }

        const createdChecklist = await createChecklist({
          buildingId,
          checklistTemplate: editedChecklistTemplate,
          responsibleId,
          startDate: setDate,
          interval: numberFrequency,
          status,
          groupId,
        });

        childrenChecklists.push(createdChecklist);
      }
    }

    return res
      .status(201)
      .json({ ServerMessage: { message: 'Checklist cadastrado com sucesso.' } });
  }

  if (newChecklist) {
    checkValues([{ label: 'Checklist', type: 'object', value: newChecklist }]);

    const groupId = uuidv4().replace(/-/g, '').substring(0, 12);

    const createdChecklist = await createChecklist({
      buildingId,
      newChecklist,
      responsibleId,
      startDate: setToUTCMidnight(new Date(startDate)),
      interval: numberFrequency,
      status,
      groupId,
    });

    return res.status(201).json(createdChecklist);
  }

  return res.status(400).json({ ServerMessage: { message: 'Checklist inválido.' } });

  // if (frequencyInDays) {
  //   // criando 3 anos de registros proporcional a data
  //   const frequenciesToCreate = Math.ceil((365 / frequencyInDays) * 3);

  //   const childrenChecklists: prismaTypes.ChecklistUncheckedCreateInput[] = [];

  //   for (let index = 0; index < frequenciesToCreate; index++) {
  //     childrenChecklists.push({
  //       groupId: parentChecklist.groupId,
  //       buildingId: parentChecklist.buildingId,
  //       name: parentChecklist.name,
  //       description: parentChecklist.description,
  //       syndicId: parentChecklist.syndicId,
  //       frequency: parentChecklist.frequency,
  //       frequencyTimeIntervalId: parentChecklist.frequencyTimeIntervalId,
  //       status: 'pending',
  //       date: addDays({
  //         date: parentChecklist.date,
  //         days: frequencyInDays * index + frequencyInDays,
  //       }),
  //       detailImages: {
  //         createMany: {
  //           data: Array.isArray(detailImages) ? detailImages : [],
  //         },
  //       },
  //     });
  //   }

  //   await prisma.$transaction(childrenChecklists.map((data) => prisma.checklist.create({ data })));
  // }

  // return res.status(201).json({ ServerMessage: { message: 'Checklist cadastrado com sucesso.' } });
}
