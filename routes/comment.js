const express = require("express");
const router = express.Router();
const comment = require("../controllers/commentController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 댓글 작성
router.post("/write/:board_id", isLoggedIn, comment.write);

// 댓글 삭제
router.get("/delete/:id", isLoggedIn, comment.delete);

module.exports = router;
