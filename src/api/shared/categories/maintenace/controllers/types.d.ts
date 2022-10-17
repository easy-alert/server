export interface ICreateMaintenaceBody {
  categoryId: string;
  ownerCompanyId: string | null;
  body: {
    element: string;
    activity: string;
    frequency: number;
    frequencyTimeIntervalId: string;
    responsible: string;
    source: string;
    period: number;
    periodTimeIntervalId: string;
    delay: number;
    delayTimeIntervalId: string;
    observation: string;
  };
}
