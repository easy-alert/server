export type TPermissionsNames =
  // admin permissions
  | 'admin:backoffice'
  | 'admin:company'
  | 'admin:client'

  // access permissions
  | 'access:backoffice'
  | 'access:company'
  | 'access:client'
  | 'access:buildingManager'
  | 'access:dashboard'
  | 'access:calendar'
  | 'access:buildings'
  | 'access:checklist'
  | 'access:tickets'
  | 'access:reports'
  | 'access:suppliers'
  | 'access:tutorials'
  | 'access:account'

  // backoffice permissions
  // company permissions
  // client permissions
  // dashboard permissions
  // calendar permissions
  // tutorials permissions

  // buildings permissions
  | 'buildings:create'
  | 'buildings:update'
  | 'buildings:delete'

  // checklist permissions
  | 'checklist:access'

  // tickets permissions
  | 'tickets:access'

  // reports permissions
  | 'reports:access'

  // suppliers permissions
  | 'suppliers:access'

  // account permissions
  | 'account:edit';
