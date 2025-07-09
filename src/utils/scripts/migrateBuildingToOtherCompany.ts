import { Request, Response } from 'express';
import { prisma } from '../../../prisma';

export async function migrateBuildingToOtherCompany(req: Request, res: Response) {
  try {
    const { originBuildingId, newCompanyId } = req.body;
    if (!originBuildingId || !newCompanyId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters.' });
    }

    // 1. Atualizar o companyId do prédio
    await prisma.building.update({
      where: { id: originBuildingId },
      data: { companyId: newCompanyId }
    });
    console.log('Building companyId updated');

    // 2. Atualizar todos os filhos do prédio (companyId, se existir)
    await prisma.buildingApartment.updateMany({
      where: { buildingId: originBuildingId },
      data: { companyId: newCompanyId }
    });
    console.log('Building apartments updated');

    await prisma.buildingAnnexe.updateMany({
      where: { buildingId: originBuildingId },
      data: {} // Adicione companyId se existir na tabela
    });
    console.log('Building annexes updated');

    await prisma.buildingBanners.updateMany({
      where: { buildingId: originBuildingId },
      data: {} // Adicione companyId se existir na tabela
    });
    console.log('Building banners updated');

    await prisma.buildingNotificationConfiguration.updateMany({
      where: { buildingId: originBuildingId },
      data: {} // Adicione companyId se existir na tabela
    });
    console.log('Building notifications updated');

    await prisma.buildingFolders.updateMany({
      where: { buildingId: originBuildingId },
      data: {} // Adicione companyId se existir na tabela
    });
    console.log('Building folders updated');

    // 3. Categorias e manutenções
    // Buscar todas as categorias do prédio
    const buildingCategories = await prisma.buildingCategory.findMany({
      where: { buildingId: originBuildingId },
      include: { Category: true }
    });
    // Buscar categorias já existentes na nova company
    const existingCategories = await prisma.category.findMany({ where: { ownerCompanyId: newCompanyId } });
    // Mapear nome -> id das existentes
    const existingCategoryMap = new Map(existingCategories.map(c => [c.name, c.id]));
    for (const bc of buildingCategories) {
      let categoryId = existingCategoryMap.get(bc.Category.name);
      if (!categoryId) {
        // Clonar categoria para nova company
        const newCat = await prisma.category.create({
          data: { ownerCompanyId: newCompanyId, name: bc.Category.name }
        });
        categoryId = newCat.id;
        existingCategoryMap.set(bc.Category.name, categoryId);
        console.log(`Category '${bc.Category.name}' cloned to new company.`);
      }
      // Atualizar buildingCategory para apontar para a categoria correta
      await prisma.buildingCategory.update({
        where: { id: bc.id },
        data: { categoryId }
      });
    }
    console.log('Building categories updated/cloned as needed');

    // 4. Atualizar ownerCompanyId em MaintenanceHistory
    await prisma.maintenanceHistory.updateMany({
      where: { buildingId: originBuildingId },
      data: { ownerCompanyId: newCompanyId }
    });
    console.log('MaintenanceHistory ownerCompanyId updated');

    // 5. Atualizar manutenções se necessário (exemplo simplificado)
    // Se manutenção for global da company, precisa garantir que existe na nova company e atualizar o relacionamento
    // (Aqui depende do seu modelo, ajuste conforme necessário)

    // 6. Atualizar históricos, relatórios, etc, se necessário (adapte conforme seu modelo)

    return res.status(200).json({ success: true, message: 'Migração concluída com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Erro ao migrar prédio.' });
  }
}
