export interface ICheckPermission {
  permission: 'Backoffice' | 'Company';
  UserPermissions: [
    {
      Permission: {
        name: string;
      };
    },
  ];
}
