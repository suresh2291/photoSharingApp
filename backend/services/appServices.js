const Code = require("../db/schemas/codeModel");
const React = require("../db/schemas/reactModel");
const Comment = require('../db/schemas/commentsModel');
const Post = require("../db/schemas/postModel");
const User = require("../db/schemas/userModel");
const fs = require("fs");
const crypto = require('crypto');

const { serverConfig } = require("../configs/index");
const { generateToken } = require("../helpers/tokens");
const { validateUsername } = require("../helpers/validations");
const generateCode = require("../helpers/generateCode");
const { generatePassword } = require("../modules/password");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../helpers/mailers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  compressFiles,
  uploadToCloudinary,
  insertIntoDB,
  uploadFiles,
  cloudinaryProfileImages
} = require("../modules/imageUpload");
const mongoose = require("../db/connectdb");
function photoAppService() {}
/*-----------------------------------USERS--------------------------------*/
photoAppService.prototype.getUsers = async function (req, res, next) {
  res.send("welcome from user home");
};

photoAppService.prototype.Auth = async function (req, res, next) {
  res.send(`welcome from user`);
};

photoAppService.prototype.registerUser = async function (req, res, next) {
  try {
    const { firstName, lastName, email, gender, bYear, bMonth, bDay } =
      req.body;

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "Sorry, that email address is already taken. Please log in or use a different email address to register.",
      });
    }

    const password = await generatePassword(req.body.password);
    let tempUserName = firstName.replace(/\s+/g, '') + lastName.replace(/\s+/g, '');
    let userName = await validateUsername(tempUserName);

    //const verifyEmail = generateToken({ id: user._id.toString() }, "30m");
    let code = crypto.randomUUID();
    const url = `${serverConfig.port.frontEndUrl}/activate?token=${code}`;
    const sendmail = await sendVerificationEmail(
      email,
      firstName,
      url
    );
    if (sendmail === "Success") {
      const user = await new User({
        firstName,
        lastName,
        userName,
        email,
        password,
        gender,
        bYear,
        bMonth,
        bDay,
        code
      }).save();
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.status(200).json({
        id: user._id,
        userName: user.userName,
        picture: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
        verified: user.verified,
        message: `Please check your email. After you have verified your email, you can close this window and start using your account.`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.activateUser = async function (req, res, next) {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const checkUser = await User.findOne({code: token});
    if (validUser !== checkUser.id) {
      return res.status(400).json({
        message: "You don't have the authorization to complete this operation.",
      });
    }
    if (checkUser.verified === true) {
      return res.status(400).json({
        message:
          "Your account has already been activated. You can close this window and start using your account.",
      });
    } else {
      await User.findByIdAndUpdate(checkUser.id, { verified: true });
      return res.status(200).json({
        message:
          "Welcome to our app! Your account is now active and ready to use.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.resendVerification = async function (req, res, next) {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res
        .status(400)
        .json({ message: "Your account has already been activated." });
    }
    const url = `${serverConfig.port.frontEndUrl}/activate?token=${user.code}`;
    console.log('email:   ',user.email,'  firstName:  ', user.firstName, '  url:  ', url)
    await sendVerificationEmail(user.email, user.firstName, url);
    return res
      .status(200)
      .json({ message: "Email verification send to your email." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:
          "We're sorry, but the email address you entered doesn't match our records. Please try again or create new account.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message:
          "Oops! It looks like your password is incorrect. Please try again or click 'forgotten password' to reset it.",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.status(200).json({
      id: user._id,
      userName: user.userName,
      picture: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      verified: user.verified,
      message: `Welcome back ${user.firstName}! We're so excited to have you here! You can now share and discover the most beautiful photos with other users.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.updateProfilePicture = async function (req, res, next) {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      avatar: url,
    });
    res.json(url);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.updateCoverPicture = async function (req, res, next) {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json(url);
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.updateDetails = async function (req, res, next) {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/*-----------------------------------USERS--------------------------------*/

/*-----------------------------------RESET PASSWORD--------------------------------*/
photoAppService.prototype.findUser = async function (req, res, next) {
  try {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        return res.status(400).json({
          message: "Account does not exists.",
        });
      }
      return res.status(200).json({
        email: user.email,
        picture: user.avatar,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.verifyCode = async function (req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res.status(200).json({ message: "code verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.sendResetPasswordCode = async function (
  req,
  res,
  next
) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    await new Code({
      code,
      user: user._id,
    }).save();
    sendResetPasswordEmail(user.email, user.firstName, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.changePassword = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const newPassword = await generatePassword(req.body.password);
    await User.findOneAndUpdate(
      { email },
      {
        password: newPassword,
      }
    );
    return res.status(200).json({ message: "password changed" });
  } catch (error) {
    res.status(500).json({ message: e.message });
  }
};
/*-----------------------------------RESET PASSWORD--------------------------------*/

/*-----------------POST-------------------*/
photoAppService.prototype.createPost = async function (req, res, next) {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "firstName lastName cover avatar userName cover");
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.getPosts = async function (req, res, next) {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate("user", "firstName lastName avatar userName cover")
        .populate({
          path: "comments",
          populate: {
            path: "commentBy",
            select: "firstName lastName userName avatar cover commentAt"
          }
        })
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPosts = await (await Promise.all(promises)).flat();
    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "firstName lastName avatar userName cover")
      .populate({
        path: "comments",
        populate: {
          path: "commentBy",
          select: "firstName lastName userName avatar cover commentAt"
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);
    followingPosts.push(...[...userPosts]);
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json({"data":followingPosts});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


photoAppService.prototype.reactPosts = async function (req, res, next) {
  try {
    const { postId, react } = req.body;
    const check = await React.findOne({
      postRef: postId,
      reactBy: req.user.id //mongoose.Types.ObjectId(req.user.id),
    });
    if (check == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });
      await newReact.save();
    } else {
      if (check.react == react) {
        await React.findByIdAndRemove(check._id);
      } else {
        await React.findByIdAndUpdate(check._id, {
          react: react,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });

    /*
    const check1 = reacts.find(
      (x) => x.reactBy.toString() == req.user.id
    )?.react;
    */
    const newReacts = reactsArray.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});

    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
      {
        react: "congrats",
        count: newReacts.congrats ? newReacts.congrats.length : 0,
      }
    ];

    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user?.savedPosts.find(
      (x) => x.post.toString() === req.params.id
    );
    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


photoAppService.prototype.savePost = async (req, res) => {
  try {
    const postId = req.query.id;
    const user = await User.findById(req.user.id);
    const check = user?.savedPosts.find(
      (post) => post.post.toString() == postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.query.id);
    res.json({ "status": "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.comments = async function (req, res, next) {
  try {
    const { comment, image, postId } = req.body;
    const newComment = new Comment({
            postId,
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
    });
    if(!newComment) return res.status(500).json({message:"something went wrong !!"});
    
    //save comment 
    await newComment.save();
    
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: newComment._id
        },
      },
      {
        new: true,
      }
    ).populate({
      path: "comments",
      populate: {
        path: "commentBy",
        select: "firstName lastName userName avatar cover"
      }
    })

    res.json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*------------------------------POST-------------------*/

/*---------------------UPLOAD IMAGES-------------------*/
photoAppService.prototype.uploadImages = async function (req, res, next) {
  try {
    const files = req.files;

    const { path, userId, filename, profilepic, coverpic } = req.body;
 
    if (!files) {
      return res.status(400).send("No file uploaded.");
    }
    const compressedFiles = await compressFiles(files, userId, filename, profilepic, coverpic);
    const result = await uploadFiles(compressedFiles, path);
    await insertIntoDB(result.insertDB);

    res.status(200).json(result.cloudUrl);
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
photoAppService.prototype.uploadCloudinaryUri = async function (
  req,
  res,
  next
) {
  try {
    const { uri, path } = req.body;
    if (!uri) {
      return res.status(400).send("No file uploaded.");
    }
    const result = await uploadToCloudinary(uri, path);
    // const result = await uploadFiles(compressedFiles, path);
    // await insertIntoDB(result.insertDB);
    res.status(200).json(result.url);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/*---------------------UPLOAD IMAGES-------------------*/

/*---------------------Profile-------------------*/
photoAppService.prototype.getProfileImages = async function (req, res, next) {
  try {
    const { path, sort, max } = req.body;
    const result = await cloudinaryProfileImages(path, sort, max)
    result.resources.forEach(resource => {
      delete resource.created_by.access_key;
      delete resource.uploaded_by.access_key;
    });
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.error.message });
  }
};

photoAppService.prototype.getUserProfile = async function (req, res, next) {
  try {
    const { username } = req.query;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ userName:username }).select("-password -code");
    const friendship = {
      friends: false, //true - we are friends
      following: false, //true - I follow you.
      requestSent: false, //true- I sent you a request
      requestReceived: false, //true- I received a request
    };
    if (!profile) {
      return res.json({ ok: false });
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }
    const posts = await Post.find({ user: profile._id })
                            .populate("user")
                            .populate({
                              path: "comments",
                              populate: {
                                path: "commentBy",
                                select: "firstName lastName userName avatar cover commentAt"
                              }
                            })
                            .sort({ createdAt: -1 });
    await profile.populate("friends", "firstName lastName userName avatar");
    res.json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/*---------------------Profile-------------------*/


/*------FRIENDS: ADD CANCEL REQUEST, FOLLOW UN-FOLLOW, DELETE-------------------*/
/**
 * While sending request you must not send to yourself, 
 * here sender is yourself and receiver is the other user
 * we should also check whether he is already in your friends and requests list.
 * When i send request to other user, 
 * -> I would be sending the request to the user
 * -> The user would would become my followers 
 * -> I would be following him.
 */
photoAppService.prototype.sendRequest = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.query.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "friend request has been sent" });
      } else {
        return res.status(400).json({ message: "Already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * While Cancel request you can't cancel to yourself, 
 * here sender is yourself and receiver is the other user
 * we should also check whether he is already in your friends and requests list.
 * When i cancel request to other user, 
 * -> I would be cancel the requested to the user
 * -> I would remove from my followers list
 * -> I would reomve from my friends list
 */
photoAppService.prototype.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.query.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: sender._id },
        });
        res.json({ message: "you successfully canceled request" });
      } else {
        return res.status(400).json({ message: "Already Canceled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't cancel a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * I am the one who would follow the receiver(end user)
 * I cannot follow myself
 */
photoAppService.prototype.follow = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.query.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });

        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * is Opposite to follow.
 */
photoAppService.prototype.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.query.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });

        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "unfollow success" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * In the Accept Request, I would become the Receiver and Sender would be the other user.
 * Cases 
 * -> I should not accept myself
 * ->I should  include in the request list,
 * ->I should be in the friends and following users list
 * ->I shouldI should be able to accepts the users request.
 */
photoAppService.prototype.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.query.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $push: { friends: sender._id, following: sender._id },
        });
        await sender.update({
          $push: { friends: receiver._id, followers: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({ message: "friend request accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't accept a request from  yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * swender myself and receiver is other user
 * both myself and end user to unfriend form the friends, following and followers
 */
photoAppService.prototype.unFriend = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.query.id);
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await receiver.update({
          $pull: {
            friends: sender._id,
            following: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            friends: receiver._id,
            following: receiver._id,
            followers: receiver._id,
          },
        });

        res.json({ message: "unfriend request accepted" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfriend yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.query.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.query.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $pull: {
            requests: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            following: receiver._id,
          },
        });

        res.json({ message: "delete request accepted" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res.status(400).json({ message: "You can't delete yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*------FRIENDS: ADD CANCEL REQUEST, FOLLOW UN-FOLLOW, DELETE-------------------*/

/*---------------------------Search------------------------*/
photoAppService.prototype.search = async (req, res) => {
  try {
    const searchTerm = req.query.user;
    const regex = new RegExp(searchTerm, 'i');
    const results = await User.find({ $text: { $search: regex }},{ score: { $meta: "textScore" } }
    ).sort(
        { score: { $meta: "textScore" } }
    ).select(
      "firstName lastName userName avatar"
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser);
    if (check) {
      await User.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: { "search.$.createdAt": new Date() },
        }
      );
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "firstName lastName userName avatar");
    res.json(results.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.removeFromSearch = async (req, res) => {
  try {
    const { searchUser } = req.body;
    await User.updateOne(
      {
        _id: req.user.id,
      },
      { $pull: { search: { user: searchUser } } }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

photoAppService.prototype.getFriendsPageInfos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends requests")
      .populate("friends", "firstName lastName avatar cover userName")
      .populate("requests", "firstName lastName avatar cover userName");
    const sentRequests = await User.find({
      requests: mongoose.Types.ObjectId(req.user.id),
    }).select("firstName lastName avatar cover userName");
    res.json({
      friends: user.friends,
      requests: user.requests,
      sentRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*---------------------------Search------------------------*/

module.exports = {
  getInst: function () {
    return new photoAppService();
  },
};
