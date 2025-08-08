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
  | 'access:calendarMaintenances'
  | 'access:calendarTickets'
  | 'access:buildings'
  | 'access:maintenances'
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
  | 'checklist:create'
  | 'checklist:update'
  | 'checklist:delete'
  | 'checklist:livePhoto'

  // tickets permissions
  | 'tickets:create'
  | 'tickets:update'
  | 'tickets:delete'

  // reports permissions

  // suppliers permissions

  // account permissions
  | 'account:update'

  // maintenances permissions
  | 'maintenances:plan'
  | 'maintenances:update'
  | 'maintenances:updateDates'
  | 'maintenances:delete'
  | 'maintenances:createOccasional'
  | 'maintenances:finish'
  | 'maintenances:livePhoto'

  // management permissions
  | 'management:checklist'
  | 'management:account';
