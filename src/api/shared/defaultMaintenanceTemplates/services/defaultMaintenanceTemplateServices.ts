import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../prisma';

class DefaultMaintenanceTemplateServices {
  async findTemplateById({ templateId }: { templateId: string }) {
    const defaultMaintenanceTemplate = await prisma.defaultMaintenanceTemplate.findUnique({
      select: {
        id: true,
        name: true,

        DefaultTemplateCategories: {
          select: {
            DefaultTemplateMaintenances: {
              select: {
                maintenanceId: true,
              },
            },
          },
        },
      },

      where: {
        id: templateId,
      },
    });

    return defaultMaintenanceTemplate;
  }

  async findTemplateByName({ name }: { name: string }) {
    const defaultMaintenanceTemplate = await prisma.defaultMaintenanceTemplate.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        name,
      },
    });

    return defaultMaintenanceTemplate;
  }

  async listTemplates() {
    const defaultMaintenanceTemplates = await prisma.defaultMaintenanceTemplate.findMany({
      select: {
        id: true,
        name: true,
        DefaultTemplateCategories: {
          select: {
            id: true,
            Category: {
              select: {
                id: true,
                name: true,
                ownerCompanyId: true,
              },
            },

            DefaultTemplateMaintenances: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return defaultMaintenanceTemplates;
  }

  async listTemplatesForSelect() {
    const templates = await prisma.defaultMaintenanceTemplate.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return templates;
  }

  async createTemplate(data: Prisma.DefaultMaintenanceTemplateUncheckedCreateInput) {
    const defaultMaintenanceTemplate = await prisma.defaultMaintenanceTemplate.create({
      data,
    });

    return defaultMaintenanceTemplate;
  }

  async createCategory(data: Prisma.DefaultTemplateCategoryUncheckedCreateInput) {
    const category = await prisma.defaultTemplateCategory.create({
      data,
    });

    return category;
  }

  async createMaintenance(data: Prisma.DefaultTemplateMaintenanceUncheckedCreateInput) {
    await prisma.defaultTemplateMaintenance.create({
      data,
    });
  }
}

export const defaultMaintenanceTemplateServices = new DefaultMaintenanceTemplateServices();
