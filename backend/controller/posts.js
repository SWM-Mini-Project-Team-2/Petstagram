import { v4 as uuid } from "uuid";
import db from "../config/firebase.js";

const postRef = db.collection("post");
const likeRef = db.collection("like");
const userRef = db.collection("user");

// GET posts
const getPosts = async (req, res) => {
    try {
        const sort = req.query["sort"];
        const follow = JSON.parse(req.query["follow"]);
        const like = JSON.parse(req.query["like"]);
        const userId = req.headers["authorization"].split(" ")[1];

        let order = sort == 0 ? "createdAt" : "like";
        let follows, likes;

        const snapshot = await postRef.orderBy(order, "desc").get();
        const data = [];

        let userSnapShot, userData;
        let likeSnapShot, likeData;

        if (follow) {
            userSnapShot = await userRef.doc(userId).get();
            userData = userSnapShot.data();
            follows = userData["follows"];
        }

        if (like) {
            likeSnapShot = await likeRef.doc(userId).get();
            likeData = likeSnapShot.data();
            likes = likeData !== undefined ? likeData["post_list"] : [];
        }

        snapshot.forEach((doc) => {
            const eachData = doc.data();
            eachData.id = doc.id;

            // get followed posts
            if (follow && !follows.includes(eachData["userId"])) {
                return;
            }

            // get liked posts
            if (like && !likes.includes(eachData["id"])) {
                return;
            }

            data.push(eachData);
        });
        res.status(200).json({ data });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};
// GET my posts
const getMyPosts = async (req, res) => {
    try {
        const userId = req.headers["authorization"].split(" ")[1];

        let order = "createdAt";

        const snapshot = await postRef.orderBy(order, "desc").get();
        const data = [];

        snapshot.forEach((doc) => {
            const eachData = doc.data();
            eachData.id = doc.id;

            if (userId == eachData["userId"]) {
                data.push(eachData);
            }
        });

        const postNum = data.length;
        res.status(200).json({ data, postNum });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};
// GET a post
const getPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const snapshot = await postRef.doc(postId).get();
        const data = snapshot.data();

        // update view + 1
        await postRef.doc(postId).update({ view: data.view + 1 });

        const userRef = db.collection("user");
        const userSnapShot = await userRef.doc(data["userId"]).get();
        const userData = userSnapShot.data();

        data.id = postId;
        data.view = data.view + 1;
        data.userName = userData["name"];

        res.status(200).json({ data });
    } catch (e) {
        res.status(400).json({ error: "Error" });
    }
};
// POST a post
const createPost = async (req, res) => {
    try {
        const randomId = uuid();
        const today = new Date();
        const userId = req.headers["authorization"].split(" ")[1];

        let data = req.body;
        console.log(userId);
        console.log(data);

        data["userId"] = userId;
        data["view"] = 0;
        data["like"] = 0;
        data["createdAt"] = today.toISOString();

        await postRef.doc(randomId).set(data);
        res.status(201).json({ data, message: "created a post!" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};
// Like a post
const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.headers["authorization"].split(" ")[1];

        const likeSnapShot = await likeRef.doc(userId).get();
        const likeData = likeSnapShot.data();

        const postSnapShot = await postRef.doc(postId).get();
        const postData = postSnapShot.data();

        let post_list, removeIdx;
        let like = postData.like;
        let data = {};
        // If user does not exist in like table
        // create a user document in like table
        if (likeData === undefined) {
            const newPostData = {};
            newPostData["post_list"] = [postId];

            like += 1;
            data["like"] = like;
            data["liked"] = true;
            await likeRef.doc(userId).set(newPostData);
        }
        // else exists
        // update user's liked post list
        else {
            post_list = likeData["post_list"];
            removeIdx = post_list.indexOf(postId);

            // already liked the post
            if (removeIdx > -1) {
                post_list.splice(removeIdx, 1);
                like -= 1;
                data["like"] = like;
                data["liked"] = false;
            } else {
                post_list.push(postId);
                like += 1;
                data["like"] = like;
                data["liked"] = true;
            }

            await likeRef.doc(userId).update({ post_list });
        }

        // update like
        await postRef.doc(postId).update({ like });

        res.status(201).json({
            data,
            message: "liked a post!",
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};
// Check a post is liked or not
const checkPostLiked = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.headers["authorization"].split(" ")[1];

        const likeSnapShot = await likeRef.doc(userId).get();
        const likeData = likeSnapShot.data();

        let data, message;

        if (likeData === undefined) {
            data = false;
            message = "There are no liked posts.";
        } else {
            if (likeData["post_list"].includes(postId)) {
                data = true;
                message = "Already liked a post!";
            } else {
                data = false;
                message = "You did not like the post.";
            }
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
// Check followed or not
const checkFollowed = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.headers["authorization"].split(" ")[1];

        const postSnapShot = await postRef.doc(postId).get();
        const postData = postSnapShot.data();

        const followUserId = postData["userId"];
        const userSnapShot = await userRef.doc(userId).get();
        const userData = userSnapShot.data();

        let data, message;

        if (userId == followUserId) {
            data = null;
            message = "It's your post!";
        } else if (userData["follows"].includes(followUserId)) {
            data = true;
            message = "You followed the user.";
        } else {
            data = false;
            message = "You did not follow the user";
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
// DELETE a post
const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        await postRef.doc(postId).delete();

        let data = true;
        let message = "Deleted successfully";

        res.status(201).json({
            data,
            message,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};

const change = async (req, res) => {
    try {
        const snapShot = await postRef.get();

        snapShot.forEach(async (doc) => {
            const data = doc.data();
            const docId = doc.id;
            const createdAt = data.createdAt;

            // console.log(createdAt);
            let date = new Date(createdAt._seconds);
            let Y, M, D, h, m, s;

            date.setFullYear(2022);
            date.setMonth(11);

            if (date == "Invalid Date") {
                Y = Number(createdAt.substring(0, 4));

                M = Number(createdAt.substring(6, 8));
                if (M[1] == ".") {
                    M = M[0];
                    n += 1;
                }

                D = Number(createdAt.substring(10, 12));
                if (D[1] == ".") {
                    D = D[0];
                    n += 1;
                }

                h = Number(createdAt.substring(16, 18));
                m = Number(createdAt.substring(19, 21));
                s = Number(createdAt.substring(22, 24));

                date = new Date(Y, M - 1, D - 1, h, m, s);
            }

            date = date.toISOString();
            await postRef.doc(docId).update({ createdAt: date });
        });

        // update like
        // await postRef.doc(postId).update({ like });

        res.status(201).json({
            message: "liked a post!",
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error" });
    }
};

export {
    getPosts,
    getMyPosts,
    getPost,
    createPost,
    likePost,
    checkPostLiked,
    checkFollowed,
    deletePost,
    change,
};
