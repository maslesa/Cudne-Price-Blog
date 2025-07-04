const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    shortDesc: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }]
}, {timestamps: true});