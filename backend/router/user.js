import express from "express";
import {
    checkDuplication,
    createUser,
    followUser,
    getMyName,
    getUsers,
    login,
} from "../controller/users.js";

const router = express.Router();

// GET users
router.get("/", getUsers);

// Login
router.post("/login", login);

// POST user
router.post("/", createUser);

// check email duplication when sign up
router.post("/duplicate", checkDuplication);

// follow the user
router.post("/:userId/follow", followUser);

// get my name
router.get("/myname", getMyName);

export default router;
