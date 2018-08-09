const async = require('async');
const UserRepository = require('./user.repository');
const TokenService = require('../../common/services/token.service');
const CompanyService = require('../company/company.service');
const GroupService = require('../group/group.service');
const ErrorService = require('../../common/services/error.service');

class UserService {
	constructor() {
		this.UserRepository = UserRepository;
	}

	getAll() {
		return this.UserRepository.getAll();
	}

	getById(id) {
		return this.UserRepository.getById(id)
			.then(data => {
				if (data === null) {
					throw new Error('Object did not exist');
				} else {
					return {
						id: data.id,
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email
					};
				}
			})
			.catch(err => {
				throw ErrorService.createCustomDBError(err);
			});
	}

	save(obj) {
		return new Promise((resolve, reject) => {
			async.waterfall(
				[
					callback => {
						this.UserRepository.save(obj)
							.then(data =>
								callback(null, {
									tokenSecret: TokenService.createToken(data),
									user: data.dataValues
								})
							)
							.catch(err => callback(err, null));
					},
					(payload, callback) => {
						GroupService.saveGroup('General')
							.then(data =>
								callback(
									null,
									Object.assign({}, payload, {
										group: data.dataValues
									})
								)
							)
							.catch(err => callback(err, null));
					},
					(payload, callback) => {
						GroupService.saveGroupUser(
							payload.user.id,
							payload.group.id
						)
							.then(data =>
								callback(
									null,
									Object.assign({}, payload, {
										groupUser: data.dataValues
									})
								)
							)
							.catch(err => callback(err, null));
					},
					(payload, callback) => {
						CompanyService.saveCompany(obj)
							.then(data =>
								callback(
									null,
									Object.assign({}, payload, {
										company: data.dataValues
									})
								)
							)
							.catch(err => {
								callback(err, null);
							});
					},
					(payload, callback) => {
						CompanyService.saveCompanyUser(
							payload.user.id,
							payload.company.id
						)
							.then(data =>
								callback(
									null,
									Object.assign({}, payload, {
										companyUser: data.dataValues
									})
								)
							)
							.catch(err => {
								callback(err, null);
							});
					}
				],
				(err, payload) => {
					if (err) {
						// console.log(err);
						return reject(ErrorService.createCustomDBError(err));
					}
					// console.log(payload);
					return resolve(payload.tokenSecret);
				}
			);
		});
	}

	login(obj) {
		return this.UserRepository.findByEmail(obj.email)
			.then(data => {
				if (data === null) {
					throw new Error('Object did not exist');
				} else if (data.dataValues.password === obj.password) {
					return TokenService.createToken(data.dataValues);
				} else {
					throw new Error('Wrong password');
				}
			})
			.catch(err => {
				throw ErrorService.createCustomDBError(err);
			});
	}

	verifyToken(token) {
		return new Promise((resolve, reject) => {
			async.waterfall(
				[
					callback => {
						TokenService.verifyToken(token)
							.then(data => callback(null, data))
							.catch(err => {
								callback(err, null);
							});
					},
					(email, callback) => {
						this.UserRepository.findByEmail(email)
							.then(data => callback(null, data))
							.catch(err => {
								callback(err, null);
							});
					}
				],
				(err, payload) => {
					if (err) {
						return reject(ErrorService.createCustomDBError(err));
					}
					return resolve({
						id: payload.id,
						firstName: payload.firstName,
						lastName: payload.lastName,
						email: payload.email
					});
				}
			);
		});
	}

	removeById(id) {
		return this.UserRepository.removeById(id)
			.then(data => {
				if (data === 0) {
					throw new Error('Object did not exist');
				} else {
					return 'Object deleted';
				}
			})
			.catch(err => {
				throw ErrorService.createCustomDBError(err);
			});
	}

	updateUser(id, obj) {
		return this.UserRepository.update(id, obj)
			.then(data => {
				if (data[0] === 0) {
					throw new Error('Object did not exist');
				}
				return 'Object updated';
			})
			.catch(err => {
				throw ErrorService.createCustomDBError(err);
			});
	}
}

module.exports = new UserService();
