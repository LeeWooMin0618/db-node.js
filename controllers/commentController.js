const db = require("../config/db");

// 댓글 작성
exports.write = async (req, res) => {
  const board_id = req.params.board_id;
  const { content } = req.body;

  await db.query(
    "INSERT INTO comments (board_id, user_id, content) VALUES (?, ?, ?)",
    [board_id, req.session.user.id, content]
  );

  const [[post]] = await db.query("SELECT category FROM board WHERE id=?", [board_id]);

  res.redirect(`/board/${post.category}/view/${board_id}`);
};

// 댓글 삭제
exports.delete = async (req, res) => {
  const id = req.params.id;

  const [[comment]] = await db.query("SELECT * FROM comments WHERE id=?", [id]);

  if (comment.user_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.send("<script>alert('삭제 권한이 없습니다.'); history.back();</script>");
  }

  await db.query("DELETE FROM comments WHERE id=?", [id]);

  res.send("<script>alert('삭제 완료'); history.back();</script>");
};
