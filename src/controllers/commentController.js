import Comment from "../models/Comment.js";

/* CREATE COMMENT */
export const createComment = async (req, res) => {
  try {
    const { haircutId, text } = req.body;

    // Safety check: req.user is now the MongoDB Document from your middleware
    if (!req.user || !req.user.firebaseUid) {
      return res.status(400).json({ message: "User not authenticated or synced" });
    }

    const comment = await Comment.create({
      haircutId,
      text,
      userId: req.user.firebaseUid, // Maps to the 'required' field in your Comment Schema
      userName: req.user.name,
      userPhoto: req.user.photo,    // Matches 'photo' in your User Model
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("❌ Comment Save Error:", err.message);
    res.status(500).json({ message: "Failed to create comment", error: err.message });
  }
};

/* GET COMMENTS BY HAIRCUT */
export const getCommentsByHaircut = async (req, res) => {
  try {
    const { haircutId } = req.params;
    const comments = await Comment.find({ haircutId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* DELETE COMMENT */
/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // SECURITY CHECK: Does the Firebase UID of the logged-in user match the comment's creator?
    if (comment.userId !== req.user.firebaseUid) {
      return res.status(403).json({ message: "You can only delete your own comments!" });
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};

/* EDIT (UPDATE) COMMENT */
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // SECURITY CHECK
    if (comment.userId !== req.user.firebaseUid) {
      return res.status(403).json({ message: "You can only edit your own comments!" });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({ message: "Comment updated!", comment });
  } catch (err) {
    res.status(500).json({ message: "Error updating comment", error: err.message });
  }
};