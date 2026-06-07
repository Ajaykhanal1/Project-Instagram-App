const User = require("../models/User");
const Post = require("../models/Post");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const Comment = require("../Models/Comments");
const Notification = require("../models/Notification");
function buildCommentTree(comments) {
  const map = {};
  const roots = [];

  // create map
  comments.forEach((c) => {
    map[c._id] = { ...c._doc, replies: [] };
  });

  // build tree
  comments.forEach((c) => {
    const node = map[c._id];

    if (c.parentCommentId) {
      const parent = map[c.parentCommentId];
      if (parent) {
        parent.replies.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}
// Create Room Name
const getConversationId = (a, b) =>
  [a.toString(), b.toString()].sort().join("-");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("getPosts", async () => {
      try {
        const posts = await Post.find();

        const postsWithCommentCount = await Promise.all(
          posts.map(async (post) => {
            const commentCount = await Comment.countDocuments({
              postId: post._id,
            });

            return {
              ...post._doc,
              commentCount,
            };
          }),
        );

        socket.emit("postsData", postsWithCommentCount);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("deletePost", async ({ postId, userId }) => {
      try {
        const post = await Post.findById(postId);

        if (!post) return;

        // (IMPORTANT) Only owner can delete
        if (post.userId.toString() !== userId) {
          return;
        }

        await Post.findByIdAndDelete(postId);

        // also delete related comments (optional but recommended)
        await Comment.deleteMany({ postId });

        // notify all clients
        io.emit("postDeleted", { postId });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("getComment", async ({ postId }) => {
      try {
        socket.join(postId);

        const comments = await Comment.find({ postId })
          .populate("userId", "displayName avatar")
          .sort({ createdAt: 1 });

        const tree = buildCommentTree(comments);

        socket.emit("commentsData", tree);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(
      "addComment",
      async ({ postId, userId, text, parentCommentId }) => {
        if (!text) return;

        try {
          if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);

            if (!parent) {
              return;
            }

            if (parent.parentCommentId) {
              socket.emit("commentError", {
                message: "Cannot reply to a reply",
              });
              return;
            }
          }

          await Comment.create({
            postId,
            userId,
            text,
            parentCommentId: parentCommentId || null,
          });

          const comments = await Comment.find({ postId })
            .populate("userId", "displayName avatar")
            .sort({ createdAt: 1 });

          const tree = buildCommentTree(comments);

          io.to(postId).emit("commentsData", tree); // 🔥 ROOM ONLY
        } catch (err) {
          console.log(err);
        }
      },
    );

    socket.on("toggleCommentLike", async ({ commentId, userId }) => {
      try {
        const comment = await Comment.findById(commentId);

        if (!comment) return;

        const alreadyLiked = comment.likes.includes(userId);

        if (alreadyLiked) {
          //  UNLIKE
          comment.likes = comment.likes.filter(
            (id) => id.toString() !== userId,
          );
        } else {
          //  LIKE
          comment.likes.push(userId);
        }

        await comment.save();

        const updatedComment = await Comment.findById(commentId).populate(
          "userId",
          "displayName avatar",
        );

        io.emit("commentUpdated", updatedComment);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("toggleLike", async ({ postId, userId }) => {
      const post = await Post.findById(postId);

      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        post.likes.pull(userId);
        post.likesCount--;
      } else {
        post.likes.push(userId);
        post.likesCount++;
      }

      await post.save();

      // send updated post to ALL users
      io.emit("postUpdated", post);
    });

    socket.on("toggleBookmark", async ({ postId, userId }) => {
      try {
        const post = await Post.findById(postId);

        if (!post) return;

        const alreadySaved = post.savedBy.includes(userId);

        if (alreadySaved) {
          post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
        } else {
          post.savedBy.push(userId);
        }

        await post.save();

        io.emit("bookmarkUpdated", { postId, savedBy: post.savedBy });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("globalSearch", async ({ query, userId }, cb) => {
      try {
        if (!query || !query.trim()) {
          return cb({ users: [], posts: [] });
        }

        const regex = new RegExp(query, "i");

        // ---------------- USERS ----------------
        const users = await User.find({
          username: { $regex: regex },
          _id: { $ne: userId },
        })
          .select("username displayName avatar _id")
          .limit(5);

        // ---------------- POSTS ----------------
        const posts = await Post.find({
          caption: { $regex: regex },
        })
          .populate("userId", "username avatar")
          .select("caption mediaUrl userId")
          .limit(5);

        return cb({
          users,
          posts,
        });
      } catch (err) {
        console.error("global search error:", err);
        cb({ users: [], posts: [] });
      }
    });

    // Used in searchProfile.tsx
    socket.on("getUserProfile", async ({ userId }, cb) => {
      try {
        const user = await User.findById(userId).select(
          "username displayName avatar bio followers following followersCount followingCount",
        );

        if (!user) return cb(null);

        // optional: add post count
        const postCount = await Post.countDocuments({ userId });

        cb({
          ...user._doc,
          postCount,
        });
      } catch (err) {
        console.log(err);
        cb(null);
      }
    });

    socket.on("getUserPosts", async (userId, cb) => {
      try {
        const posts = await Post.find({ userId })
          .select("mediaUrl caption createdAt")
          .sort({ createdAt: -1 }); // newest first

        cb(posts);
      } catch (err) {
        console.log(err);
        cb([]);
      }
    });

    socket.on("followUser", async ({ currentUserId, targetUserId }) => {
      try {
        if (currentUserId === targetUserId) return;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) return;

        const alreadyFollowing = currentUser.following.includes(targetUserId);

        if (alreadyFollowing) return;

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        await Notification.create({
          toUserId: targetUserId,
          fromUserId: currentUserId,
          fromAvatar: currentUser.avatar,
          type: "follow",
          message: `${currentUser.username} started following you`,
        });

        io.to(targetUserId).emit("newNotification", {
          type: "follow",
          message: `${currentUser.username} started following you`,
          fromUserId: currentUserId,
          fromUsername: currentUser.username,
          fromAvatar: currentUser.avatar,
        });

        io.emit("followUpdated", {
          targetUserId,
          followersCount: targetUser.followers.length,
          followingCount: currentUser.following.length,
          followerId: currentUserId,
          isFollowing: true,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("unfollowUser", async ({ currentUserId, targetUserId }) => {
      try {
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) return;

        currentUser.following = currentUser.following.filter(
          (id) => id.toString() !== targetUserId,
        );

        targetUser.followers = targetUser.followers.filter(
          (id) => id.toString() !== currentUserId,
        );

        await currentUser.save();
        await targetUser.save();

        io.emit("followUpdated", {
          targetUserId,
          followersCount: targetUser.followers.length,
          followingCount: currentUser.following.length,
          followerId: currentUserId,
          isFollowing: false,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("getNotifications", async ({ userId }, cb) => {
      const notifications = await Notification.find({ toUserId: userId })
        .sort({ createdAt: -1 })
        .limit(20);

      cb(notifications);
    });

    socket.on("join_user_room", (userId) => {
      if (!userId) return;
      socket.join(userId.toString());
    });
    // Create Room id and Join room
    socket.on("join_private_chat", ({ userA, userB }) => {
      const conversationId = getConversationId(userA, userB);
      socket.join(conversationId);
      socket.emit("room_ready", conversationId);
    });

    // Receive Message From front , Store In Message/Conversation and send back to front
    socket.on("send_message", async ({ sender, receiver, message }) => {
      try {
        const conversationId = getConversationId(sender, receiver);

        // 1. Save message with proper structure (don't populate yet)
        const newMessage = await Message.create({
          sender,
          receiver,
          message,
          timestamp: new Date(),
          read: false
        });

        // 2. Update or create conversation
        let conversation = await Conversation.findOne({ conversationId });

        if (!conversation) {
          conversation = await Conversation.create({
            conversationId,
            participants: [sender, receiver],
            lastMessage: message,
            unreadCount: new Map([[receiver, 1]]),
            updatedAt: new Date(),
          });
        } else {
          conversation.lastMessage = message;
          const current = conversation.unreadCount.get(receiver) || 0;
          conversation.unreadCount.set(receiver, current + 1);
          conversation.updatedAt = new Date();
          await conversation.save();
        }

        // 3. Send message with plain IDs (not populated objects)
        // This matches what your frontend expects from the REST API
        const messageToSend = {
          _id: newMessage._id,
          sender: newMessage.sender.toString(),
          receiver: newMessage.receiver.toString(),
          message: newMessage.message,
          timestamp: newMessage.timestamp,
          read: newMessage.read
        };

        // 4. Emit to room
        io.to(conversationId).emit("new_message", messageToSend);

        // 5. Emit conversation update to both users
        const conversationUpdate = {
          conversationId: conversation._id,
          _id: conversation._id,
          userId: receiver.toString(),
          lastMessage: message,
          updatedAt: conversation.updatedAt,
        };

        // Send to sender
        io.to(sender.toString()).emit("conversation_update", {
          ...conversationUpdate,
          userId: receiver.toString(),
        });

        // Send to receiver
        io.to(receiver.toString()).emit("conversation_update", {
          ...conversationUpdate,
          userId: sender.toString(),
        });

      } catch (err) {
        console.error("send_message error:", err);
      }
    });









    socket.on("mark_read", async ({ sender, receiver }) => {
      const conversationId = getConversationId(sender, receiver);

      await Message.updateMany(
        {
          sender: sender,
          receiver: receiver,
          read: false,
        },
        {
          $set: { read: true },
        },
      );

      await Conversation.updateOne(
        { conversationId },
        {
          $set: {
            [`unreadCount.${receiver}`]: 0,
          },
        },
      );
    });
  });
};

module.exports = setupSocket;
