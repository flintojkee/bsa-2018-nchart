const async = require('async');
const _ = require('lodash');
const ProjectRepository = require('./project.repository');
const DatasetService = require('../dataset/dataset.service');
const ChartService = require('../chart/chart.service');
const GroupService = require('../group/group.service');
const MarkupTemplateService = require('../../common/services/export.services/markup-template.service');
const DocumentGeneratingService = require('../../common/services/export.services/document-generating.service');

class ProjectService {
	constructor() {
		this.ProjectRepository = ProjectRepository;
		this.DocumentGeneratingService = DocumentGeneratingService;
		this.MarkupTemplateService = MarkupTemplateService;
	}

	getAll() {
		return this.ProjectRepository.getAll();
	}

	upsertProjectCharts(objs) {
		return this.ProjectRepository.upsertProjectCharts(objs);
	}

	createProject(obj) {
		return new Promise((resolve, reject) => {
			async.waterfall(
				[
					callback => {
						if (obj.project.id) {
							this.ProjectRepository.upsert(obj.project)
								.then(() => callback(null, {
									project: {
										id: obj.project.id,
										name: obj.project.name
									}
								}))
								.catch(err => callback(err, null));
						} else {
							this.ProjectRepository.create(obj.project.name)
								.then(data => {
									callback(null, {
										project: {
											id: data.dataValues.id,
											name: data.dataValues.name
										}
									});
								})
								.catch(err => callback(err, null));
						}
					},
					(payload, callback) => {
						DatasetService.upsert(obj.project.datasets)
							.then(data => {
								callback(
									null,
									Object.assign(payload.project, {
										datasets: data
									})
								);
							})
							.catch(err => callback(err, null));
					},
					(payload, callback) => {
						ChartService.upsert(obj.project.charts)
							.then(data => {
								callback(
									null,
									Object.assign({}, payload, {
										charts: data
									})
								);
							})
							.catch(err => callback(err, null));
					},
					(payload, callback) => {
						const projectCharts = [];
						payload.charts.forEach(el => {
							projectCharts.push({
								chartId: el.id,
								projectId: payload.id
							});
						});
						this.upsertProjectCharts(projectCharts)
							.then(() => {
								callback(null, payload);
							})
							.catch(err => callback(err, null));
					}
				],
				(err, payload) => {
					if (err) {
						return reject(err);
					}
					return resolve(payload);
				}
			);
		});
	}

	handleProject(obj, res) {
		if (obj.project && !obj.groupId) {
			return this.createProject(obj);
		}
		// obj.groupId, res.locals.user
		return new Promise((resolve, reject) => {
			async.waterfall(
				[
					callback => {
						GroupService.findOneGroupUser({
							groupId: obj.groupId,
							userId: res.locals.user.id
						})
							.then(data => {
								if (data !== null) {
									return callback(null);
								}
								throw new Error(
									'Group with such user does not exist'
								);
							})
							.catch(err => {
								callback(err, null);
							});
					},
					callback => {
						this.createProject(obj)
							.then(data => {
								callback(null, data);
							})
							.catch(err => callback(err, null));
					},
					(payload, callback) => {
						GroupService.saveGroupProject({
							groupId: obj.groupId,
							projectId: payload.id,
							accessLevelId: 1
						})
							.then(() => {
								callback(null, payload);
							})
							.catch(() => callback(null, payload));
					}
				],
				(err, payload) => {
					if (err) {
						return reject(err);
					}
					return resolve(payload);
				}
			);
		});
	}

	fullProjectById(id) {
		return this.ProjectRepository.fullProjectById(id)
			.then(data => ProjectService.getProjectFromPayload(data.dataValues))
			.catch(err => err);
	}

	fullProjectsByGroupId(id) {
		return this.ProjectRepository.fullProjectsByGroupId(id).then(data => {
			const projects = [];
			data.dataValues.groupProjects.forEach(el => {
				projects.push(el.project.dataValues);
			});
			const payload = {
				projects: []
			};
			projects.forEach(el => {
				const project = ProjectService.getProjectFromPayload(el);
				payload.projects.push(project);
			});
			return payload;
		});
	}

	static getProjectFromPayload(rawProject) {
		const charts = [];
		const datasets = [];
		rawProject.projectCharts.forEach(el => {
			charts.push(_.omit(el.chart.dataValues, 'dataset'));
			datasets.push(el.chart.dataValues.dataset.dataValues);
		});
		return {
			id: rawProject.id,
			name: rawProject.name,
			createdAt: rawProject.createdAt,
			charts,
			datasets
		};
	}

	export(id, type, selector) {
		return this.DocumentGeneratingService.getDocument(id, type, selector);
	}

	exportHtml(content, type) {
		return this.MarkupTemplateService.getDocument(content, type);
	}
}

module.exports = new ProjectService();
