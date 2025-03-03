const Project = require('../models/projectSchema');
const teamMember = require('../models/teamMemberSchema');

/**
 * 
 * Create a new team member
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with new member's ID or error message
 */
async function CreateMember(req, res){

    // extract team member attributes
    const name = req.body.name;
    const mail = req.body.email;

    if(name == null || name === ''){ // if name field is empty
        return res.status(400).json({message: 'name required'});
    }

    if(mail == null || mail === ''){ // if mail field is empty
        return res.status(400).json({message: 'mail required'});
    }

    if(isValidEmail(mail) === false){// if mail field is invalid
        return res.status(400).json({message: 'invalid mail address'});
    }

    try{
        const isExists = await findIfExists(mail);
        if(isExists){  // if the mail address the user entered exists in the DB - error
            return res.status(400).json({message: 'member mail exists in DB'});
        }
        const newTeamMember = await createNewTeamMember({name, email: mail});
        return res.status(201).json({_id: newTeamMember._id});
    } catch(error){
        return res.status(500).json({message: error.message});
    }
}


/**
 * Check if a given email is valid
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email){
    const validMail = /^\S+@\S+\.\S+$/;
    return validMail.test(email);
}

/**
 * Check if a given email exists in the database
 * @param {string} email - Email address to check
 * @returns {Promise<boolean>} - True if email exists, false otherwise
 */
async function findIfExists(email){
    return await teamMember.findOne({email});
}


/**
 * Create a new team member according to given data
 * @param {Object} memberData - Data of the member
 * @returns {Promise<Object>} - Created member object
 */
async function createNewTeamMember(memberData){
    const member = new teamMember(memberData);
    await member.save();
    return member;
}

/**
 * Create a new project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with new project's ID or error message
 */
async function CreateProject(req, res){
    try{
        // extract values from the request body
        const name = req.body.name;
        const summary = req.body.summary;
        const start_date = req.body.start_date;
        const manager = req.body.manager;
        const team = req.body.team;

        // extract manager ID & team members IDs & roles
        const membersId = team.map(member => member._id);
        const roles = team.map(member => member.role);
        const managerId = manager._id;

        // validate manager & team members
        const validationError = await validateProjectInputs(managerId, membersId, roles);
        if(validationError !== null){
            return res.status(400).send({message: validationError});
        }

        //create team members array for the project
        const newMembers = team.map(newMember => ({
            member: newMember._id,
            role: newMember.role
        }));

        // create new project
        const createProject = new Project({
            name,
            summary,
            start_date,
            manager: managerId,
            team: newMembers
        });

        // save the project to DB
        await createProject.save();

        //return the new project's ID in the response
        res.status(201).send({_id: createProject._id});
    } catch(error){
        res.status(500).send({message: error.message});
    }
}


/**
 * Validate project inputs
 * @param {string} managerId - Manager ID
 * @param {Array<string>} membersId - Array of team member IDs
 * @param {Array<string>} roles - Array of team member roles
 * @returns {Promise<string|null>} - Error message or null if validations pass
 */
async function validateProjectInputs(managerId, membersId, roles){
    //check if manager exists
    const isManagerExists = await checkIfMemberExists(managerId);
    if(isManagerExists === false){
        return 'manager does not exist';
    }

    //check if team members exist & there's ar least 1
    if(membersId === null || membersId.length === 0){
        return 'at least one team member needed';
    }

    const teamMemberExists = await allMemberExist(membersId);
    if(teamMemberExists === false){
        return 'team member/s does not exist';
    }

    //validate that each team member has a rolle
    if(roles.some(role => role == null || role ==='')){
        return 'all team members need a role';
    }

    return null;
}


/**
 * Check if a member exists
 * @param {string} id - Member ID
 * @returns {Promise<boolean>} - True if member exists, false otherwise
 */
async function checkIfMemberExists(id){
    return await teamMember.findById(id).exec() !== null;
}


/**
 * Check if all members exist
 * @param {Array<string>} ids - Array of member IDs
 * @returns {Promise<boolean>} - True if all members exist, false otherwise
 */
async function allMemberExist(ids){
    const checkMembers = await teamMember.find({_id: {$in: ids}}).exec();
    return checkMembers.length === ids.length;
}

/**
 * Get all projects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with all projects or error message
 */
async function getProjects(req, res){
    try{
        const projects = await Project.find().populate('manager').populate('team.member');
        res.status(200).json(projects);
    } catch(error){
        res.status(500).send({message: error.message});
    }
}

/**
 * Add an image to a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with new image's ID or error message
 */
async function addImageToProject(req, res){
    try{

        // extract thumb & descruption from request body
        const desc = req.body.description;
        const thumb = req.body.thumb;

        //extract project id
        const PId = req.params.projectId;

        //check if description is provided
        if(desc == null){
            return res.status(400).send({message: 'description required'});
        }

        //check if thumb is provided
        if(thumb == null){
            return res.status(400).send({message: 'URL required'});
        }

        //find the project according to its id
        const project = await Project.findById(PId);
        if(project == null){
            return res.status(404).send({message: 'the project you searched for is not found'});
        }

        //check if image already exists
        const imageExistsMessage = checkIfImageExist(project, thumb);
        if(imageExistsMessage !== null){
            return res.status(400).send({message: imageExistsMessage});
        }

        //add new image to project
        project.images.push({thumb, description: desc});
        await project.save();

        //get the new image's ID
        const imageId = project.images[project.images.length-1]._id;

        //send response
        res.status(200).send({_id: imageId});
    } catch(error){
        res.status(500).send({message: error.message});
    }
}


/**
 * Check if the image already exists in the project
 * @param {Object} project - Project object
 * @param {string} thumb - Image URL
 * @returns {string|null} - Error message if image exists, null otherwise
 */
function checkIfImageExist(project, thumb){
    const isExist = project.images.some(image => image.thumb === thumb);
    if(isExist === true){
        return 'image already exists';
    }
    return null;
}

/**
 * Delete an image from a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message or error message
 */
async function deleteImageFromProject(req, res){
    try{

        const imageId = req.params.imageId;
        const PId = req.params.projectId;

        const project = await findProjectById(PId);
        if(project === null){
            return res.status(404).send({message: 'the project you searched for is not found'});
        }

        const i = findImageIndex(project, imageId);
        if(i === -1){
            return res.status(404).send({message: 'image not found'});
        }

        project.images.splice(i,1);
        await project.save();

        res.status(200).send({message: 'success - image deleted'});
    } catch(error){
        res.status(500).send({message: error.message});
    }
}


/**
 * Find a project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object|null>} - Project object if found, null otherwise
 */
async function findProjectById(projectId){
    return await Project.findById(projectId);
}


/**
 * Find the index of an image in the project
 * @param {Object} project - Project object
 * @param {string} imageId - Image ID
 * @returns {number} - Index of the image if found, -1 otherwise
 */
function findImageIndex(project, imageId){
    return project.images.findIndex(image => image._id.toString() === imageId);
}

module.exports = {
    CreateMember,
    CreateProject,
    getProjects,
    addImageToProject,
    deleteImageFromProject
};