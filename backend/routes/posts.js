const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.post("/", auth, upload.single("image"), postController.createPost);
router.put("/:id", auth, postController.updatePost);
router.delete("/:id", auth, postController.deletePost);
router.post("/:id/like", auth, postController.toggleLike);
router.post("/:id/comment", auth, postController.addComment);
router.post("/:id/save", auth, postController.toggleSave);

module.exports = router;
