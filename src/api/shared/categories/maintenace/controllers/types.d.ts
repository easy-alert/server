export interface ICreateMaintenceBody {
  ownerCompanyId: string | null;

  body: {
    categoryId: string;
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
