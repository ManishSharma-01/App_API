const Routine = require("../models/Routines")
const Workout = require("../models/Workout")
const ErrorHandler = require("../utils/error_handler")
const catchAsyncError = require("../middlewares/catchAsyncErrors")
const mongoose = require("mongoose")


exports.createRoutine = catchAsyncError(async(req,res,next)=>{
    const {
      workout,
      routineStatus,
      completedAt,
    }=req.body

    const routine = await Routine.create({
      workout,
      routineStatus,
      completedAt,
        enrolledAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json({
        success: true,
        routine
    })
})

exports.createRoutineMob = catchAsyncError(async (req, res, next) => {
  const { workout, routineStatus, completedAt } = req.body;

  const routine = await Routine.create({
    workout: workout, // Save the workout object directly in the database
    routineStatus,
    completedAt,
    enrolledAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    routine,
  });
});


exports.getSingleRoutine = catchAsyncError(async (req, res, next) => {
  const routine = await Routine.findById(req.params.id).populate(
    "username",
    "email"
  );

  if (!routine) {
    return next(new ErrorHandler("Routine not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    routine,
  });
});

// check your own routines
exports.myRoutines = catchAsyncError(async (req, res, next) => {
    const routines = await Routine.find({ user: req.user._id }).populate('workout');
    console.log(routines)
  
    res.status(200).json({
      success: true,
      routines,
    });
  });


  exports.myRoutinesMob = catchAsyncError(async (req, res, next) => {
    // Check if the request contains a valid user ID
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }
  
    // Fetch routines that belong to the user with the provided user ID
    const routines = await Routine.find({ user: req.user._id }).populate('workout');
    console.log(routines);
  
    // Respond with the routines
    res.status(200).json({
      success: true,
      routines,
    });
  });
  

  //get all orders

  exports.getAllRoutines = catchAsyncError(async (req, res, next) => {
    const routines = await Routine.find();
  
  
    res.status(200).json({
      success: true,
      routines,
    });
  });


//update routine 
// exports.updateRoutine = catchAsyncError(async (req, res, next) => {
//   const routine = await Routine.findById(req.params.id);

//   if (!routine) {
//     return next(new ErrorHandler("Routine not found with this Id", 404));
//   }

//   if (routine.routineStatus === "Completed") {
//     return next(new ErrorHandler("You have already completed this routine", 400));
//   }

//   if (req.body.routineStatus === "Completed") {
//     routine.completedAt = Date.now();
//   }

//   await routine.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//   });
// });

exports.updateRoutine = catchAsyncError(async (req, res, next) => {
  const current_routine = req.body;
  const routine = await Routine.findByIdAndUpdate(req.params.id, current_routine, {
    new: true,
    runValidators: true,
  });

  if (!routine) {
    return res.status(404).send({ message: "Routine not found" });
  }

  res.status(200).json({
    success: true,
    message: "Routine updated successfully",
    data: routine,
  });
});

//delete the routine
  exports.deleteRoutine = catchAsyncError(async (req, res, next) => {
    console.log(req.params.id);
  await Routine.findByIdAndDelete(req.params.id).then((routine) => {
    if (!routine) {
      return res
        .status(404)
        .json({ message: "Routine not found with id of ${req.params.id}" });
    }
    res.status(200).json({ success: true, data: routine });
  });
});