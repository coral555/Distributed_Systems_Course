const mongoose = require('mongoose');

// define team member schema
const teamMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is requied'],
        },
        email: {
            type: String,
            required: [true, 'email is requied'],
            unique: true,
            match: [
                /^\S+@\S+\.\S+$/, 'enter a valid email'
            ]
        },
    },
    {
        timestamps: true
    }
);

// create the model
const TeamMember = mongoose.model('Member', teamMemberSchema);
module.exports = TeamMember;
