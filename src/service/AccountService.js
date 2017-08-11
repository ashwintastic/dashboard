import Account from '../db/models/Account';
import {
  accounts as accountService
} from '../db/botData/services';

class AccountService {
  createAccount(user, manager) {
    const account = new Account({
      name: `Account [${user.email}]`,
      admin: user,
      adminEmail: user.email,
      manager,
      managerEmail: null,
      bots: [],
    });

    return account.save();
  }

  getAccountsList(sortOptions) {
    const sortBy = sortOptions.isAscending == true ? sortOptions.sortBy : `-${sortOptions.sortBy}`;
    return Account.find({}, '_id name adminEmail managerEmail timezone')
    .sort(sortBy);
  }

  findAccount(id) {
    return Account.findById(id);
  }

  findAccountByAdmin(admin) {
    return Account.find({ admin: admin._id });
  }

  getAccountListByUser(userId) {
    return Account.find({ dashboarduser: userId });
  }

  deleteAccountEntry(accountId) {
    return accountService.removeById(accountId);
  }

  createNewAccount(accountEntry) {
    return accountService.create(accountEntry);
  }

  saveAccountDetail(account) {
    return accountService.save(account);
  }

  getAccountByDetail(name) {
    return accountService.findOne({ name: name });
  }
  findAccount(id) {
    return accountService.findById(id);
  }
}

export default new AccountService();
