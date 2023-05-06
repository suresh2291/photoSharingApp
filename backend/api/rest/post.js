const express = require("express");
const router = express.Router();
const services = require("../../services/appServices");
const serviceInt = services.getInst();
const { authUser } = require("../../middlewares");

//These are the routes for posts.
router.post("/create", authUser, async (req, res, next) => {
  try {
    await serviceInt.createPost(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/posts", authUser, async (req, res, next) => {
  try {
    await serviceInt.getPosts(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/put_reacts", authUser, async (req, res, next) => {
  try {
    await serviceInt.reactPosts(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/get_reacts/:id", authUser, async (req, res, next) => {
  try {
    await serviceInt.getReacts(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/save_post", authUser, async (req, res, next) => {
  try {
    await serviceInt.savePost(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete_post", authUser, async (req, res, next) => {
  try {
    await serviceInt.deletePost(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/comments", authUser, async (req, res, next) => {
  try {
    await serviceInt.comments(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
