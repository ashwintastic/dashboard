import {
  dashboardUserAccess as dashboardUserAccessService
} from '../db/botData/services';


class UserAccessService {

  save(accessdoc) {
    return dashboardUserAccessService.save(accessdoc);
  }

  createUserAccessDoc(dashboardUserId, role, entityType, entityId) {
    return dashboardUserAccessService.createOrSave({ dashboardUserId, role, entityType, entityId }, { dashboardUserId: dashboardUserId, entityType: entityType, entityId:entityId });
  }

  deleteUserAccessDoc(id) {
    return dashboardUserAccessService.removeById(id);
  }

  getUserAccessDoc(dashboardUserId) {
    return dashboardUserAccessService.findAll({ dashboardUserId });
  }

  getUsersByEntity(entityId) {
    return dashboardUserAccessService.findAll({ entityId });
  }

  getEntityDocs(dashboardUserId, entityType) {
    return dashboardUserAccessService.findAll({ dashboardUserId: dashboardUserId, entityType: entityType });
  }
  getAccessDocByEntityId(dashboardUserId, entityId) {
    return dashboardUserAccessService.findOne({ dashboardUserId: dashboardUserId, entityId: entityId });
  }

}
export default new UserAccessService();
