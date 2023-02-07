import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();

export async function sharedDeleteMaintenance({
  ownerCompanyId,
  body: { maintenanceId },
}: {
  ownerCompanyId: string | null;
  body: { maintenanceId: string };
}) {
  validator.notNull([{ label: 'ID da manutenção', variable: maintenanceId }]);

  const maintenace = await sharedMaintenanceServices.findById({
    maintenanceId,
  });

  if (maintenace?.ownerCompanyId !== ownerCompanyId) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa manutenção pertence a outra empresa.`,
    });
  }

  await sharedMaintenanceServices.checkMaintenanceIsUsed({ maintenanceId });

  await sharedMaintenanceServices.delete({
    maintenanceId,
  });
}
