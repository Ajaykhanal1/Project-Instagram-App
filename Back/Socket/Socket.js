const Post = require("../models/Post");

const setupSocket = (io) => {
  io.on("connection", (socket) => {


    socket.on("getPosts", async () => {
      const posts = await Post.find();
      socket.emit("postsData", posts);
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

    


    

  });
};

module.exports = setupSocket;
