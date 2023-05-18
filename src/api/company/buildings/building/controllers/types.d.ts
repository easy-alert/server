interface Maintenance {
  isSelected: boolean;
  id: string;
  element: string;
  activity: string;
  frequency: number;
  delay: number;
  period: number;
  responsible: string;
  source: string;
  observation: string;
  ownerCompanyId: string;
  FrequencyTimeInterval: {
    id: string;
    name: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  DelayTimeInterval: {
    id: string;
    name: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  PeriodTimeInterval: {
    id: string;
    name: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
}

export interface IListBuildingCategoriesAndMaintenances {
  id: string;
  ownerCompanyId: string;
  name: string;
  Maintenances: Maintenance[];
}
