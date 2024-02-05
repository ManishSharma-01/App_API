const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema({

  workout: {
    type: mongoose.Schema.ObjectId,
    ref: "Workout",
    required: true,
    },
  
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  enrolledAt: {
    type: Date,
    required: true,
  },

  routineStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  completedAt: Date,

});

module.exports = mongoose.model("Routine", routineSchema);