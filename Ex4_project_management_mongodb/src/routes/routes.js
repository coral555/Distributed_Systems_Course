const express = require('express');
const router = express.Router();
const CreateMember = require('./project').CreateMember;
const CreateProject = require('./project').CreateProject;
const getProjects = require('./project').getProjects;
const addImageToProject = require('./project').addImageToProject;
const deleteImageFromProject = require('./project').deleteImageFromProject;

router.post('/members', CreateMember);
router.post('/projects', CreateProject);
router.get('/projects', getProjects);
router.post('/projects/:projectId/images', addImageToProject);
router.delete('/projects/:projectId/images/:imageId', deleteImageFromProject);

module.exports = router;