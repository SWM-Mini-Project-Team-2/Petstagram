import express from "express";
import {
    change,
    checkFollowed,
    checkPostLiked,
    createPost,
    deletePost,
    getMyPosts,
    getPost,
    getPosts,
    likePost,
} from "../controller/posts.js";

const router = express.Router();

// GET posts
router.get("/", getPosts);

// GET my posts
router.get("/my", getMyPosts);

// GET a post
router.get("/:postId", getPost);

// POST a post
router.post("/", createPost);

// Like a post
router.post("/:postId/like", likePost);

// Check a post is liked or not
router.get("/:postId/like", checkPostLiked);

// Check followed or not
router.get("/:postId/follow", checkFollowed);

// DELETE a post
router.delete("/:postId", deletePost);

router.get("/change/time", change);

export default router;
