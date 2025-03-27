export interface IFindUserById {
  userId: string;
}
export interface IListUser {
  take?: number;
  page: number;
  search: string;
}
