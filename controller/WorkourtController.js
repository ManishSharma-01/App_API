const Workout = require("../models/Workout");
const asyncHandler = require("../middlewares/catchAsyncErrors");
const fs = require("fs");
const path = require("path");



exports.getWorkouts = asyncHandler(async (req, res, next) => {
    const workout = await Workout.find({});
    res.status(200).json({
      success: true,
      count: workout.length,
      data: workout,
    });
  });

  exports.getWorkout = asyncHandler(async (req, res, next) => {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res
        .status(404)
        .json({ message: "Workout not found with id of ${req.params.id}" });
    } else {
      res.status(200).json({
        success: true,
        data: workout,
      });
    }
  });

  exports.addWorkout = asyncHandler(async (req, res, next) => {
    const workout = await Workout.findOne({ title: req.body.title });
    console.log(req.body);
    if (workout) {
      return res.status(400).send({ message: "Workout already exists" });
    }
    await Workout.create(req.body);
  
    res.status(200).json({
      success: true,
      message: "Workout added successfully",
    });
  });

  exports.MobaddWorkout = asyncHandler(async (req, res, next) => {
    const workout = await Workout.findOne({ title: req.body.title });
    console.log(req.body);
    if (workout) {
      return res.status(400).send({ message: "Workout already exists" });
    }
  
    // Create a new workout in the database
    const createdWorkout = await Workout.create(req.body);
  
    // Return the created workout data in the response
    res.status(201).json({
      success: true,
      message: "Workout added successfully",
      data: createdWorkout, // This will include the new workout's data
    });
  });
  


exports.MobupdateWorkout = asyncHandler(async (req, res, next) => {
  const current_workout = req.body;
  const workout = await Workout.findByIdAndUpdate(req.params.id, current_workout, {
    new: true,
    runValidators: true,
  });

  if (!workout) {
    return res.status(404).send({ message: "Workout not found" });
  }

  // Fetch all workouts from the database
  const allWorkouts = await Workout.find();

  res.status(200).json({
    success: true,
    message: "Workout updated successfully",
    data: allWorkouts, // Return all workouts in the data field
  });
});


  exports.updateWorkout = asyncHandler(async (req, res, next) => {
    const current_workout = req.body;
    const workout = await Workout.findByIdAndUpdate(req.params.id, current_workout, {
      new: true,
      runValidators: true,
    });
  
    if (!workout) {
      return res.status(404).send({ message: "Workout not found" });
    }
  
    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      data: workout,
    });
  });
  

  exports.getMe = asyncHandler(async (req, res, next) => {
    // Show current workout
    const workout = await Workout.findById(req.params.id);
  
    res.status(200).json({
        workout
    });
  });


  exports.deleteWorkout = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
  //   Workout.findByIdAndDelete(req.params.id)
  //     .then((workout) => {
  //       if (user != null) {
  //         var imagePath = path.join(
  //           __dirname,
  //           "..",
  //           "public",
  //           "uploads",
  //           workout.image
  //         );
  
  //         fs.unlink(imagePath, (err) => {
  //           if (err) {
  //             console.log(err);
  //           }
  //           res.status(200).json({
  //             success: true,
  //             message: "Workout deleted successfully",
  //           });
  //         });
  //       } else {
  //         res.status(400).json({
  //           success: false,
  //           message: "Workout not found",
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       res.status(500).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     });
  // }
  await Workout.findByIdAndDelete(req.params.id).then((workout) => {
    if (!workout) {
      return res
        .status(404)
        .json({ message: "Workout not found with id of ${req.params.id}" });
    }
    res.status(200).json({ success: true, data: workout });
  });
});


exports.uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
      success: true,
      data: req.file.filename,
    });
  }); 
  

//Creating the review
exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, workoutId } = req.body;
  console.log(workoutId)

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  console.log(review)

  const workout = await Workout.findById(workoutId);
 

  const isReviewed = workout.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    workout.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
    console.log(isReviewed)
  } else {
    workout.reviews.push(review);
    workout.numOfReviews = workout.reviews.length;
  }

  let avg = 0;

  workout.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  workout.ratings = avg / workout.reviews.length;

  await workout.save({ validateBeforeSave: false });

  res.status(200).json({
      success:true,
      review
  })
});

exports.getWorkoutReviews = (async(req,res,next)=> {
    const workout = await Workout.findById(req.query.id);

    if(!workout){
        return next(new Error("Product not found",404))
    }
    res.status(200).json({
        success: true,
        reviews: workout.reviews
    })
})

// Delete Review
exports.deleteWorkoutReview = asyncHandler(async (req, res, next) => {
const workout = await Workout.findById(req.query.workoutId);

if (!workout) {
  return next(new ErrorHandler("Workout not found", 404));
}

const reviews = workout.reviews.filter(
  (rev) => rev._id.toString() !== req.query.id.toString()
);

let avg = 0;

reviews.forEach((rev) => {
  avg += rev.rating;
});

let ratings = 0;

if (reviews.length === 0) {
  ratings = 0;
} else {
  ratings = avg / reviews.length;
}

const numOfReviews = reviews.length;

await Workout.findByIdAndUpdate(
  req.query.workoutId,
  {
    reviews,
    ratings,
    numOfReviews,
  },
  {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }
);

res.status(200).json({
  success: true,
});
});
  
  