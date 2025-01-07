interface IHandleDashboardFilter {
  buildings: string | string[];
  categories: string | string[];
  responsible: string | string[];
  startDate: Date;
  endDate: Date;
  companyId: string;
}

export function handleDashboardFilter({
  buildings,
  categories,
  responsible,
  startDate,
  endDate,
  companyId,
  maintenanceType,
}: IHandleDashboardFilter) {
  const dashboardFilter = {
    period: { lte: endDate, gte: startDate },

    buildings:
      buildings && JSON.parse(String(buildings))?.length > 0
        ? {
            in: JSON.parse(String(buildings)),
          }
        : undefined,
    categories:
      categories && JSON.parse(String(categories))?.length > 0
        ? {
            in: JSON.parse(String(categories)),
          }
        : undefined,
    responsible:
      responsible && JSON.parse(String(responsible))?.length > 0
        ? {
            some: {
              name: { in: JSON.parse(String(responsible)) },
            },
          }
        : undefined,
    companyId,
  };

  return dashboardFilter;
}
