const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../Models/Comments");
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




  });
};

module.exports = setupSocket;
