import type { Request, Response } from 'express';

import { findManyStock } from '../services/findManyStock';
import { countStock } from '../services/countStock';

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

export async function getStockController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingIds, stockItemTypesIds, search, page, limit } = req.query as unknown as {
    buildingIds: string[];
    stockItemTypesIds: string[];
    search: string;
    page: string;
    limit: string;
  };

  const buildingIdsFilter = buildingIds?.length > 0 ? buildingIds : undefined;
  const stockItemTypesIdsFilter = stockItemTypesIds?.length > 0 ? stockItemTypesIds : undefined;

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId, required: true }]);

  const stocks = await findManyStock<StockOutput>({
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

          take: 1,

          orderBy: {
            movementDate: 'desc',
          },
        },
      },

      where: {
        isActive: true,

        building: {
          companyId,
        },

        ...(buildingIdsFilter && { buildingId: { in: buildingIdsFilter } }),
        ...(stockItemTypesIdsFilter && {
          stockItem: { stockItemTypeId: { in: stockItemTypesIdsFilter } },
        }),

        ...(search && {
          OR: [
            {
              building: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },

            {
              stockItem: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },

            {
              stockItem: {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },

            {
              stockItem: {
                stockItemType: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },

            {
              stockItem: {
                stockItemType: {
                  description: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        }),

        ...(page && {
          skip: (Number(page) - 1) * Number(limit),
        }),

        ...(limit && {
          take: Number(limit),
        }),
      },

      orderBy: {
        building: {
          name: 'asc',
        },
      },
    },
  });

  const stocksCount = await countStock({
    data: {
      where: {
        building: {
          companyId,
        },

        ...(buildingIdsFilter && { buildingId: { in: buildingIdsFilter } }),
        ...(stockItemTypesIdsFilter && {
          stockItem: { stockItemTypeId: { in: stockItemTypesIdsFilter } },
        }),

        ...(search && {
          OR: [
            {
              building: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },

            {
              stockItem: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },

            {
              stockItem: {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },

            {
              stockItem: {
                stockItemType: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },

            {
              stockItem: {
                stockItemType: {
                  description: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        }),
      },
    },
  });

  return res.status(200).json({
    stocks,
    stocksCount,
  });
}
