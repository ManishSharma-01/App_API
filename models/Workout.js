const mongoose = require('mongoose')

const remarkSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

const workoutSchema = new mongoose.Schema({
    image: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        required: true
    },
    nameOfWorkout: {
        type: String,
        required: true
    },
    numberOfReps: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },

    remarks: [remarkSchema]
});


module.exports = mongoose.model('Workout', workoutSchema)