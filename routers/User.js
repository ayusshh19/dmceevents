import express from "express";
import {
  register, login
} from "../controllers/User.js";
import { addcommittee, getcommittee, updateCommittee, deleteCommittee } from "../controllers/Committee.js";
import { addevent, getevnt, updateevent,deleteevent ,approvedby} from "../controllers/Events.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/addcommittee").post(addcommittee);
router.route("/getcommittee").get(getcommittee);
router.route("/updatecommittee").put(updateCommittee);
router.route("/deletecommittee").delete(deleteCommittee);

router.route("/addevent").post(addevent)
router.route("/getevent").get(getevnt)
router.route("/updatevent").put(updateevent)
router.route("/deleteevent").delete(deleteevent)
router.route("/approvedevent").put(approvedby)



export default router;