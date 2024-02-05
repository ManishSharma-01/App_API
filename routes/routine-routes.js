const express = require("express")
const {createRoutine, 
        createRoutineMob,
       getSingleRoutine,
       myRoutines,
       myRoutinesMob,
       getAllRoutines,
       updateRoutine,
       deleteRoutine
        } = require("../controller/RoutineController")
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.route("/create").post(protect,createRoutine)
router.route("/createRoutine").post(protect,createRoutineMob)
router.route("/myRoutines").get(protect,myRoutines)
router.route("/myRoutinesMob").get(protect,myRoutinesMob)
router.route("/getallRoutines").get(protect,getAllRoutines)
// router.route("/admin/routines").get(authorizedRole("admin"),getAllRoutines)
router.route("/user/routine/getall").get(protect,getAllRoutines)
router.route("/getsingleRoutine/:id").get(protect,getSingleRoutine)
router.route("/update/:id").put(protect,updateRoutine)
router.route("/delete/:id").delete(protect,deleteRoutine)
module.exports = router
