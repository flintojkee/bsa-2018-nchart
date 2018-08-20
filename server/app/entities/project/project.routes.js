const project = require('express').Router();
const ProjectService = require('../../entities/project/project.service');
const PayloadGeneratorService = require('../../common/services/payload-generator.service');

project.get('/', (req, res, next) => {
	ProjectService.getAll()
		.then(PayloadGeneratorService.nextWithData(next, res))
		.catch(next);
});

project.post('/', (req, res, next) => {
	ProjectService.handleProject(req.body, req.headers.authorization)
		.then(PayloadGeneratorService.nextWithData(next, res))
		.catch(next);
});

module.exports = project;
