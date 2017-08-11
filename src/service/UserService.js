import User from '../db/models/User';
import {
  dashboardUsers as dashboardUsersService
} from '../db/botData/services';
import { userRoles as userRolesService } from '../db/botData/services';
import { systemLinks as systemLinksService } from '../db/botData/services';
import uuid from 'node-uuid';


class UserService {
  findFacebookUser(profileId) {
    return User.findOne({
      'auth.facebook.key': profileId
    });
  }

  createFacebookUser(email, profileId, accessToken) {
    const user = new User({
      email,
      roles: ['AccountAdmin'],
      auth: {
        facebook: {
          key: profileId,
          accessToken: accessToken || profileId
        }
      },
      userAccessToken: ''
    });
    return user.save();
  }

  addResetPasswordLink(mailId, expiry) {
    return systemLinksService.create({ email: mailId, expiry: expiry });
  }
  deleteResetPasswordLink(mailId) {
    return systemLinksService.removeAll({ email: mailId });
  }
  getResetLinkData(id) {
    return systemLinksService.findById(id);
  }

  findUser(id) {
    return dashboardUsersService.findById(id);
    // return User.findById(id);
  }

  save(dashboardUser) {
    return dashboardUsersService.save(dashboardUser);
  }

  getAllUserRoles() {
    return userRolesService.findAll({});
  }

  createNewUser(userEntry, emailConfirmed) {
    return dashboardUsersService.create(userEntry, emailConfirmed);
  }

  getDashboardUser(email, roles) {
    return dashboardUsersService.findAll({ email: email, roles: roles });
  }

  getAllUsers() {
    return dashboardUsersService.findAll({});
  }

  getDashboardUserByMail(email) {
    return dashboardUsersService.findOne({ email: email });
  }
  deleteUserEntry(userId) {
    return dashboardUsersService.removeById(userId);
  }
}

export default new UserService();
