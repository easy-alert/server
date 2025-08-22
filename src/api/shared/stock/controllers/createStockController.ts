import type { Stock } from '@prisma/client';
import type { Request, Response } from 'express';

import { findFirstStock } from '../services/findFirstStock';
import { createStock } from '../services/createStock';
import { createFirstStockMovement } from '../../stockMovement/businessRules/createFirstStockMovement';
import { updateStock } from '../services/updateStock';

import { checkValues } from '../../../../utils/newValidator';

interface StockOutput {
  id: string;
  quantity: number;
  minimumQuantity: number;
  location: string;
  notes: string;
  lastUpdated: Date;
  isActive: boolean;

  stockItem: {
    id: string;
    name: string;
    description: string;
    unit: string;
    isActive: boolean;

    stockItemType: {
      id: string;
      name: string;
    };
  };

  building: {
    id: string;
    name: string;
  };

  movements: {
    movementType: string;
    movementDate: Date;

    lastUpdatedBy: {
      id: string;
      name: string;
    };
  };
}

interface StockExists {
  id: string;

  stockItem: {
    id: string;
    name: string;
  };

  building: {
    id: string;
    name: string;
  };
}

export async function createStockController(req: Request, res: Response) {
  const { userId, companyId } = req;
  const { buildingId, stockItemId, quantity, minimumQuantity, location, notes } = req.body as Stock;

  const quantityNumber = Number(quantity);
  const minimumQuantityNumber = Number(minimumQuantity);

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
    { label: 'ID da edificação', type: 'string', value: buildingId, required: true },
    { label: 'ID do item', type: 'string', value: stockItemId, required: true },
    { label: 'ID do criador', type: 'string', value: userId, required: false },
    { label: 'Quantidade', type: 'int', value: quantityNumber, required: true },
    { label: 'Quantidade mínima', type: 'int', value: minimumQuantityNumber, required: true },
    { label: 'Localização', type: 'string', value: location, required: false },
    { label: 'Notas', type: 'string', value: notes, required: false },
  ]);

  const existingActiveStock = await findFirstStock<StockExists>({
    data: {
      select: {
        id: true,

        stockItem: {
          select: {
            id: true,
            name: true,
          },
        },

        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      where: {
        buildingId,
        stockItemId,
        isActive: true,
      },
    },
  });

  if (existingActiveStock) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: `Um estoque do item '${existingActiveStock.stockItem.name}' já foi cadastrado na edificação '${existingActiveStock.building.name}'.`,
      },
    });
  }

  const existingInactiveStock = await findFirstStock<StockExists>({
    data: {
      select: {
        id: true,

        stockItem: {
          select: {
            id: true,
            name: true,
          },
        },

        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      where: {
        buildingId,
        stockItemId,
        isActive: false,
      },
    },
  });

  let stock: StockOutput | null = null;

  // activate existing inactive stock
  if (existingInactiveStock) {
    stock = await updateStock<StockOutput>({
      data: {
        select: {
          id: true,

          quantity: true,
          minimumQuantity: true,
          location: true,
          notes: true,
          lastUpdated: true,
          isActive: true,

          stockItem: {
            select: {
              id: true,
              name: true,
              description: true,
              unit: true,
              isActive: true,

              stockItemType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },

          building: {
            select: {
              id: true,
              name: true,
            },
          },

          movements: {
            select: {
              movementType: true,
              movementDate: true,

              lastUpdatedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },

        data: {
          quantity: quantityNumber,
          minimumQuantity: minimumQuantityNumber,
          location,
          notes,
          isActive: true,
          lastUpdated: new Date(),

          ...(userId && {
            createdBy: {
              connect: {
                id: userId,
              },
            },
          }),
        },

        where: {
          id: existingInactiveStock.id,
        },
      },
    });
  } else {
    stock = await createStock<StockOutput>({
      data: {
        select: {
          id: true,

          quantity: true,
          minimumQuantity: true,
          location: true,
          notes: true,
          lastUpdated: true,
          isActive: true,

          stockItem: {
            select: {
              id: true,
              name: true,
              description: true,
              unit: true,
              isActive: true,

              stockItemType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },

          building: {
            select: {
              id: true,
              name: true,
            },
          },

          movements: {
            select: {
              movementType: true,
              movementDate: true,

              lastUpdatedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },

        data: {
          quantity: quantityNumber,
          minimumQuantity: minimumQuantityNumber,
          location,
          notes,
          isActive: true,
          lastUpdated: new Date(),

          building: {
            connect: {
              id: buildingId,
            },
          },

          stockItem: {
            connect: {
              id: stockItemId,
            },
          },

          ...(userId && {
            createdBy: {
              connect: {
                id: userId,
              },
            },
          }),
        },
      },
    });
  }

  if (!stock) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao cadastrar estoque.',
      },
    });
  }

  await createFirstStockMovement({
    stockId: stock.id,
    companyId,
    stockItemId: stock.stockItem.id,
    initialBalance: quantityNumber,
    createdById: userId,
  });

  return res.status(201).json({
    stock,
    ServerMessage: {
      statusCode: 201,
      message: `Estoque com o item '${stock.stockItem.name}' cadastrado com sucesso na edificação '${stock.building.name}'.`,
    },
  });
}
