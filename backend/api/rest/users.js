const express = require("express");
const router = express.Router();
const services = require("../../services/appServices");
const { authUser } = require("../../middlewares");
const serviceInt = services.getInst();

//routes used for users.
router.post("/register", async (req, res, next) => {
  try {
    await serviceInt.registerUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/activate", authUser, async(req, res, next) => {
  try {
    await serviceInt.activateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/resendverification", authUser, async(req, res, next) => {
  try {
    await serviceInt.resendVerification(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async(req, res, next) => {
  try {
    await serviceInt.login(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/", async(req, res, next) => {
  try {
    await serviceInt.getUsers(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/checkauthstatus", authUser, async(req, res, next) => {
  try {
    await serviceInt.Auth(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/update_profile_picture", authUser, async(req, res, next) => {
  try {
    await serviceInt.updateProfilePicture(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/update_cover", authUser, async(req, res, next) => {
  try {
    await serviceInt.updateCoverPicture(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/update_details", authUser, async(req, res, next) => {
  try {
    await serviceInt.updateDetails(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/send_request", authUser, async(req, res, next) => {
  try {
    await serviceInt.sendRequest(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/cancel_request", authUser, async(req, res, next) => {
  try {
    await serviceInt.cancelRequest(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/follow", authUser, async(req, res, next) => {
  try {
    await serviceInt.follow(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/unfollow", authUser, async(req, res, next) => {
  try {
    await serviceInt.unfollow(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/accept_request", authUser, async(req, res, next) => {
  try {
    await serviceInt.acceptRequest(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/unfriend", authUser, async(req, res, next) => {
  try {
    await serviceInt.unFriend(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/delete_request", authUser, async(req, res, next) => {
  try {
    await serviceInt.deleteRequest(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/search", authUser, async(req, res, next) => {
  try {
    await serviceInt.search(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/search_history", authUser, async(req, res, next) => {
  try {
    await serviceInt.addToSearchHistory(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/get_search_history", authUser,async(req, res, next) => {
  try {
    await serviceInt.getSearchHistory(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/remove_search", authUser,async(req, res, next) => {
  try {
    await serviceInt.removeFromSearch(req, res, next);
  } catch (error) {
    next(error);
  }
}); 

router.get("/get_friends_list", authUser,async(req, res, next) => {
  try {
    await serviceInt.getFriendsPageInfos(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/chat", authUser,async(req, res, next) => {
  try {
    await serviceInt.chat(req, res, next);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
