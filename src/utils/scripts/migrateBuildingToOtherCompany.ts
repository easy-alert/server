import { Request, Response } from 'express';
import { prisma } from '../../../prisma';

interface MigrationResult {
  success: boolean;
  newBuildingId?: string;
  error?: string;
  details?: {
    buildingCloned: boolean;
    categoriesCloned: number;
    maintenancesCloned: number;
    annexesCloned: number;
    bannersCloned: number;
    maintenanceHistoryCloned: number;
    apartmentsCloned: number;
    notificationsCloned: number;
  };
}

export async function migrateBuildingToOtherCompany(req: Request, res: Response) {
  try {
    const { originBuildingId, newCompanyId } = req.body;

    // Input validation
    if (!originBuildingId || !newCompanyId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: originBuildingId and newCompanyId',
      });
    }

    if (typeof originBuildingId !== 'string' || typeof newCompanyId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameter types: originBuildingId and newCompanyId must be strings',
      });
    }

    if (originBuildingId.trim() === '' || newCompanyId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Parameters cannot be empty strings',
      });
    }

    // Execute migration
    const result = await executeMigration(originBuildingId, newCompanyId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Building migration completed successfully',
        data: result,
      });
    } 
      return res.status(400).json({
        success: false,
        error: result.error,
        data: result,
      });
    
  } catch (error) {
    console.error('Building migration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during building migration',
    });
  }
}

async function executeMigration(
  originBuildingId: string,
  newCompanyId: string
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    details: {
      buildingCloned: false,
      categoriesCloned: 0,
      maintenancesCloned: 0,
      annexesCloned: 0,
      bannersCloned: 0,
      maintenanceHistoryCloned: 0,
      apartmentsCloned: 0,
      notificationsCloned: 0,
    },
  };

  try {
    // Verify that both building and company exist
    const originBuilding = await prisma.building.findUnique({
      where: { id: originBuildingId },
    });

    if (!originBuilding) {
      result.error = 'Origin building not found';
      return result;
    }

    const newCompany = await prisma.company.findUnique({
      where: { id: newCompanyId },
    });

    if (!newCompany) {
      result.error = 'New company not found';
      return result;
    }

    // Check if building is already in the target company
    if (originBuilding.companyId === newCompanyId) {
      result.error = 'Building is already in the target company';
      return result;
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // 1. Clone the building
      const newBuilding = await tx.building.create({
        data: {
          buildingTypeId: originBuilding.buildingTypeId,
          companyId: newCompanyId,
          name: originBuilding.name,
          cep: originBuilding.cep,
          city: originBuilding.city,
          state: originBuilding.state,
          neighborhood: originBuilding.neighborhood,
          streetName: originBuilding.streetName,
          area: originBuilding.area,
          deliveryDate: originBuilding.deliveryDate,
          warrantyExpiration: originBuilding.warrantyExpiration,
          keepNotificationAfterWarrantyEnds: originBuilding.keepNotificationAfterWarrantyEnds,
          mandatoryReportProof: originBuilding.mandatoryReportProof,
          isActivityLogPublic: originBuilding.isActivityLogPublic,
          guestCanCompleteMaintenance: originBuilding.guestCanCompleteMaintenance,
          image: originBuilding.image,
          isBlocked: originBuilding.isBlocked,
          residentPassword: originBuilding.residentPassword,
          syndicPassword: originBuilding.syndicPassword,
          nextMaintenanceCreationBasis: originBuilding.nextMaintenanceCreationBasis,
        },
      });

      result.details!.buildingCloned = true;
      result.newBuildingId = newBuilding.id;

      // 2. Clone building apartments
      const apartments = await tx.buildingApartment.findMany({
        where: { buildingId: originBuildingId },
      });

      for (const apartment of apartments) {
        await tx.buildingApartment.create({
          data: {
            companyId: newCompanyId,
            buildingId: newBuilding.id,
            number: apartment.number,
            floor: apartment.floor,
          },
        });
        result.details!.apartmentsCloned++;
      }

      // 3. Clone building annexes
      const annexes = await tx.buildingAnnexe.findMany({
        where: { buildingId: originBuildingId },
      });

      for (const annexe of annexes) {
        await tx.buildingAnnexe.create({
          data: {
            buildingId: newBuilding.id,
            name: annexe.name,
            originalName: annexe.originalName,
            url: annexe.url,
          },
        });
        result.details!.annexesCloned++;
      }

      // 4. Clone building banners
      const banners = await tx.buildingBanners.findMany({
        where: { buildingId: originBuildingId },
      });

      for (const banner of banners) {
        await tx.buildingBanners.create({
          data: {
            buildingId: newBuilding.id,
            originalName: banner.originalName,
            url: banner.url,
            redirectUrl: banner.redirectUrl,
          },
        });
        result.details!.bannersCloned++;
      }

      // 5. Clone building notification configurations
      const notifications = await tx.buildingNotificationConfiguration.findMany({
        where: { buildingId: originBuildingId },
      });

      for (const notification of notifications) {
        await tx.buildingNotificationConfiguration.create({
          data: {
            buildingId: newBuilding.id,
            name: notification.name,
            email: notification.email,
            emailIsConfirmed: notification.emailIsConfirmed,
            role: notification.role,
            contactNumber: notification.contactNumber,
            contactNumberIsConfirmed: notification.contactNumberIsConfirmed,
            isMain: notification.isMain,
            showContact: notification.showContact,
            lastNotificationDate: notification.lastNotificationDate,
            password: notification.password,
          },
        });
        result.details!.notificationsCloned++;
      }

      // 6. Clone building folders
      const buildingFolders = await tx.buildingFolders.findMany({
        where: { buildingId: originBuildingId },
      });

      for (const buildingFolder of buildingFolders) {
        await tx.buildingFolders.create({
          data: {
            buildingId: newBuilding.id,
            folderId: buildingFolder.folderId,
          },
        });
      }

      // 7. Clone maintenance additional information
      const additionalInfo = await tx.maintenanceAdditionalInformation.findMany({
        where: { buildingId: originBuildingId },
      });

      for (const info of additionalInfo) {
        await tx.maintenanceAdditionalInformation.create({
          data: {
            buildingId: newBuilding.id,
            maintenanceId: info.maintenanceId,
            userId: info.userId,
            information: info.information,
          },
        });
      }

      // 8. Clone categories and maintenances
      const buildingCategories = await tx.buildingCategory.findMany({
        where: { buildingId: originBuildingId },
        include: {
          Category: true,
          Maintenances: {
            include: {
              Maintenance: true,
            },
          },
        },
      });

      for (const buildingCategory of buildingCategories) {
        // Check if category exists in new company, if not create it
        let newCategory = await tx.category.findFirst({
          where: {
            ownerCompanyId: newCompanyId,
            name: buildingCategory.Category.name,
          },
        });

        if (!newCategory) {
          newCategory = await tx.category.create({
            data: {
              ownerCompanyId: newCompanyId,
              name: buildingCategory.Category.name,
            },
          });
        }

        // Create building category relationship
        const newBuildingCategory = await tx.buildingCategory.create({
          data: {
            buildingId: newBuilding.id,
            categoryId: newCategory.id,
          },
        });

        result.details!.categoriesCloned++;

        // Clone maintenances for this category
        for (const buildingMaintenance of buildingCategory.Maintenances) {
          const maintenance = buildingMaintenance.Maintenance;

          // Check if maintenance is company-specific (has ownerCompanyId)
          let newMaintenanceId: string;

          if (maintenance.ownerCompanyId) {
            // This is a company-specific maintenance, clone it for the new company
            const newMaintenance = await tx.maintenance.create({
              data: {
                categoryId: newCategory.id,
                ownerCompanyId: newCompanyId,
                maintenanceTypeId: maintenance.maintenanceTypeId,
                element: maintenance.element,
                activity: maintenance.activity,
                frequency: maintenance.frequency,
                frequencyTimeIntervalId: maintenance.frequencyTimeIntervalId,
                responsible: maintenance.responsible,
                source: maintenance.source,
                period: maintenance.period,
                periodTimeIntervalId: maintenance.periodTimeIntervalId,
                delay: maintenance.delay,
                delayTimeIntervalId: maintenance.delayTimeIntervalId,
                observation: maintenance.observation,
                priorityName: maintenance.priorityName,
              },
            });

            newMaintenanceId = newMaintenance.id;
            result.details!.maintenancesCloned++;

            // Clone maintenance instructions
            const instructions = await tx.maintenanceInstruction.findMany({
              where: { maintenanceId: maintenance.id },
            });

            for (const instruction of instructions) {
              await tx.maintenanceInstruction.create({
                data: {
                  maintenanceId: newMaintenance.id,
                  name: instruction.name,
                  url: instruction.url,
                },
              });
            }
          } else {
            // This is a global maintenance, use the same ID
            newMaintenanceId = maintenance.id;
          }

          // Create building maintenance relationship
          await tx.buildingMaintenance.create({
            data: {
              buildingCategoryId: newBuildingCategory.id,
              maintenanceId: newMaintenanceId,
              daysToAnticipate: buildingMaintenance.daysToAnticipate,
            },
          });
        }
      }

      // 9. Clone maintenance history
      const maintenanceHistories = await tx.maintenanceHistory.findMany({
        where: { buildingId: originBuildingId },
        include: {
          Maintenance: true,
        },
      });

      for (const history of maintenanceHistories) {
        // Find the corresponding maintenance in the new company
        let newMaintenanceId = history.maintenanceId;

        // If the maintenance was company-specific, we need to find the cloned version
        if (history.Maintenance.ownerCompanyId) {
          const buildingCategories = await tx.buildingCategory.findMany({
            where: { buildingId: newBuilding.id },
            select: { categoryId: true },
          });

          const clonedMaintenance = await tx.maintenance.findFirst({
            where: {
              categoryId: {
                in: buildingCategories.map((bc: any) => bc.categoryId),
              },
              ownerCompanyId: newCompanyId,
              element: history.Maintenance.element,
              activity: history.Maintenance.activity,
            },
          });

          if (clonedMaintenance) {
            newMaintenanceId = clonedMaintenance.id;
          }
        }

        const newHistory = await tx.maintenanceHistory.create({
          data: {
            buildingId: newBuilding.id,
            maintenanceId: newMaintenanceId,
            ownerCompanyId: newCompanyId,
            maintenanceStatusId: history.maintenanceStatusId,
            notificationDate: history.notificationDate,
            dueDate: history.dueDate,
            resolutionDate: history.resolutionDate,
            daysInAdvance: history.daysInAdvance,
            wasNotified: history.wasNotified,
            inProgress: history.inProgress,
            showToResident: history.showToResident,
            priorityName: history.priorityName,
          },
        });

        result.details!.maintenanceHistoryCloned++;

        // Clone maintenance reports
        const reports = await tx.maintenanceReport.findMany({
          where: { maintenanceHistoryId: history.id },
        });

        for (const report of reports) {
          const newReport = await tx.maintenanceReport.create({
            data: {
              maintenanceHistoryId: newHistory.id,
              origin: report.origin,
              observation: report.observation,
              cost: report.cost,
              responsibleSyndicId: null, // Will need to be mapped to new notification config
              version: report.version,
            },
          });

          // Clone report annexes
          const reportAnnexes = await tx.maintenanceReportAnnexes.findMany({
            where: { maintenanceReportId: report.id },
          });

          for (const annexe of reportAnnexes) {
            await tx.maintenanceReportAnnexes.create({
              data: {
                maintenanceReportId: newReport.id,
                name: annexe.name,
                originalName: annexe.originalName,
                url: annexe.url,
              },
            });
          }

          // Clone report images
          const reportImages = await tx.maintenanceReportImages.findMany({
            where: { maintenanceReportId: report.id },
          });

          for (const image of reportImages) {
            await tx.maintenanceReportImages.create({
              data: {
                maintenanceReportId: newReport.id,
                name: image.name,
                originalName: image.originalName,
                url: image.url,
              },
            });
          }
        }

        // Clone maintenance activities
        const activities = await tx.maintenanceHistoryActivity.findMany({
          where: { maintenanceHistoryId: history.id },
        });

        for (const activity of activities) {
          const newActivity = await tx.maintenanceHistoryActivity.create({
            data: {
              maintenanceHistoryId: newHistory.id,
              type: activity.type,
              title: activity.title,
              content: activity.content,
            },
          });

          // Clone activity images
          const activityImages = await tx.maintenanceHistoryActivityImage.findMany({
            where: { activityId: activity.id },
          });

          for (const image of activityImages) {
            await tx.maintenanceHistoryActivityImage.create({
              data: {
                activityId: newActivity.id,
                name: image.name,
                url: image.url,
              },
            });
          }
        }

        // Clone maintenance suppliers
        const suppliers = await tx.maintenanceHistorySupplier.findMany({
          where: { maintenanceHistoryId: history.id },
        });

        for (const supplier of suppliers) {
          await tx.maintenanceHistorySupplier.create({
            data: {
              maintenanceHistoryId: newHistory.id,
              supplierId: supplier.supplierId,
            },
          });
        }

        // Clone maintenance users
        const users = await tx.maintenanceHistoryUsers.findMany({
          where: { maintenanceHistoryId: history.id },
        });

        for (const user of users) {
          await tx.maintenanceHistoryUsers.create({
            data: {
              maintenanceHistoryId: newHistory.id,
              userId: user.userId,
            },
          });
        }
      }
    });

    result.success = true;
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error occurred';
    return result;
  }
}

// Example usage:
/*
import { migrateBuildingToOtherCompany } from './migrateBuildingToOtherCompany';

async function example() {
  const result = await migrateBuildingToOtherCompany(
    'origin-building-id',
    'new-company-id'
  );

  if (result.success) {
    console.log('Migration successful!');
    console.log('New building ID:', result.newBuildingId);
    console.log('Details:', result.details);
  } else {
    console.error('Migration failed:', result.error);
  }
}
*/
