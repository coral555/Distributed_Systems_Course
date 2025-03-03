const express = require('express'); // Import the Express module
const router = express.Router(); // Create a new router object to define routes
const projectController = require('./projectController'); // Import the project controller module

// Define routes for the HTTP requsts
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/images', projectController.addImagesToProject);
router.delete('/:id/images/:imageId', projectController.deleteImageFromProject);
router.post('/:id/team', projectController.addTeamMember);
router.delete('/:id/team/:email', projectController.removeTeamMember);
router.get('/images/search', projectController.searchUnsplashImages);

module.exports = router; // export the router object so it can be used in other parts of the code
