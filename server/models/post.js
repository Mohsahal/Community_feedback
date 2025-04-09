// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     language: {
//       type: String,
//       trim: true,
//     },
//     imageUrl: {
//       type: String,
//       trim: true,
//     },
//     location: {
//       type: String,
//       trim: true,
//     },
//     feeling: {
//       type: String,
//       trim: true,
//     },
//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     comments: [
//       {
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         text: {
//           type: String,
//           required: true,
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Post", postSchema);



const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imagePublicId: {  // Add this to store Cloudinary public ID for deletion if needed
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    feeling: {
      type: String,
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);


// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   language: { type: String },
//   imageUrl: { type: String },
//   location: { type: String },
//   feeling: { type: String },
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   comments: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       text: { type: String, required: true },
//       createdAt: { type: Date, default: Date.now },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Post", postSchema);