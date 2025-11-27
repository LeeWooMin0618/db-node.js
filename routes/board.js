const express = require("express");
const router = express.Router();
const board = require("../controllers/boardController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

// 목록
router.get("/:category", board.list);

// 검색
router.get("/:category/search", board.search);

// 글 보기
router.get("/:category/view/:id", board.view);

// 글 작성
router.get("/:category/write", isLoggedIn, board.writeForm);
router.post("/:category/write", isLoggedIn, board.write);


// 글 수정
router.get("/:category/edit/:id", isLoggedIn, board.editForm);
router.post("/:category/edit/:id", isLoggedIn, board.edit);

// 글 삭제
router.get("/:category/delete/:id", isLoggedIn, board.delete);

module.exports = router;


