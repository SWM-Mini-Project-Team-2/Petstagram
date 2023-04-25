import { v4 as uuid } from "uuid";
import db from "../config/firebase.js";

const userRef = db.collection("user");

// GET users
const getUsers = async (req, res) => {
    try {
        const snapshot = await userRef.get();
        // const snapshot = await userRef.where("name", "==", "Tom").get();
        const data = [];
        snapshot.forEach((doc) => {
            const eachData = doc.data();
            eachData.id = doc.id;

            data.push(eachData);
        });
        res.status(200).json({ data });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};

// Login
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const snapshot = await userRef.where("email", "==", email).get();
        if (snapshot.docs.length == 0) {
            res.status(200).json({ data: "wrong" });
            return;
        }

        const data = snapshot.docs[0].data();
        const id = snapshot.docs[0].id;

        if (data["password"] == password) {
            res.cookie("token", id, {
                maxAge: 1000 * 60 * 60 * 24,
            });
            res.status(200).json({ data: "success" });
        } else {
            res.status(200).json({ data: "wrong" });
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "error" });
    }
};

// POST user
const createUser = async (req, res) => {
    try {
        const randomId = uuid();

        let data = req.body;
        data["follows"] = [""];

        await userRef.doc(randomId).set(data);
        res.status(201).json({ data: "created user" });
    } catch (e) {
        res.status(400).json({ error: "Error" });
    }
};

// check email duplication when sign up
const checkDuplication = async (req, res) => {
    try {
        let data = req.body;
        const email = data.email;

        const userSnapShot = await userRef.get();
        const userData = userSnapShot.docs;
        let storedEmail;
        for (const data of userData) {
            storedEmail = data.data().email;
            if (storedEmail == email) {
                res.status(201).json({ data: true, message: "Duplicate!" });
                return;
            }
        }

        res.status(201).json({ data: false, message: "No duplicate!" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};

// follow the user
const followUser = async (req, res) => {
    try {
        const followUserId = req.params.userId;
        const userId = req.cookies["token"];

        const userSnapShot = await userRef.doc(userId).get();
        const userData = userSnapShot.data();

        const follows = userData["follows"];
        const removeIdx = follows.indexOf(followUserId);

        let data, message;
        // remove the user in follow list
        if (removeIdx > -1) {
            follows.splice(removeIdx, 1);
            await userRef.doc(userId).update({ follows });
            data = false;
            message = "unfollowed";
        }
        // insert the user in follow list
        else {
            follows.push(followUserId);
            await userRef.doc(userId).update({ follows });
            data = true;
            message = "followed";
        }

        res.status(201).json({
            data,
            message,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};

// get my name
const getMyName = async (req, res) => {
    try {
        const userId = req.cookies["token"];

        const userSnapShot = await userRef.doc(userId).get();
        const userData = userSnapShot.data();

        let data = userData["name"];
        let message = "My name";

        res.status(201).json({
            data,
            message,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};

export { getUsers, login, createUser, checkDuplication, followUser, getMyName };
