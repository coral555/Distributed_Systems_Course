const mongoose = require('mongoose');
const Project = require('../models/projectSchema');
const TeamMember = require('../models/teamMemberSchema');

// Function to clear the DB
async function clearDatabase(){
    try{
        await Project.deleteMany({});
        await TeamMember.deleteMany({});
        console.log('Database cleared');
    } catch(error){
        console.error('Error clearing DB: ', error);
    }
}

// set mongoose option to suppress the warning
mongoose.set('strictQuery', true);

// establish connection to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/projectManagmentEx4', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('connected to mongoDB'); // if the connection established successfully
        await clearDatabase(); // clear the DB after the connection established
    })
    .catch((ERROR) => {
        console.error('error connecting to mongoDB: ', ERROR);
    });