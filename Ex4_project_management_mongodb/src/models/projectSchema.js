const mongoose = require('mongoose');
const Validation = require('mongoose-id-validator');

// define project schema
const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'project name is required'],
        },
        summary: {
            type: String,
            required: [true, 'project summary is required'],
            minlength: [20, 'Summary must be at least 20 characters long'],
            maxlength: [80, 'Summary cannot exceed 80 characters']
        },
        start_date: {
            type: Date,
            required: [true, 'start date is required'],
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: [true, 'manager is required']
        },
        team: [
            {
                member: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Member',
                    required: [true, 'team member required']
                },
                role: {
                    type: String,
                    required: [true, 'role is required']
                }
            }
        ],
        images: [
            {
                thumb: {
                    type: String,
                    required: false
                },
                description: {
                    type: String,
                    required: false
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// apply the validator to the schema
projectSchema.plugin(Validation);

// create the model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;