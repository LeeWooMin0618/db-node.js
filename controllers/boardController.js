const db = require("../config/db");

// 목록 + 페이징
exports.list = async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    "SELECT board.*, users.username FROM board JOIN users ON board.user_id = users.id WHERE category=? ORDER BY id DESC LIMIT ? OFFSET ?", 
    [category, limit, offset]
  );

  const [[{ count }]] = await db.query(
    "SELECT COUNT(*) AS count FROM board WHERE category=?", [category]
  );

  const totalPage = Math.ceil(count / limit);

  res.render("list", { list: rows, category, page, totalPage, user: req.session.user });
};

// 검색
exports.search = async (req, res) => {
  const category = req.params.category;
  const keyword = `%${req.query.keyword}%`;

  const [rows] = await db.query(
    "SELECT board.*, users.username FROM board JOIN users ON board.user_id = users.id WHERE category=? AND title LIKE ? ORDER BY id DESC",
    [category, keyword]
  );

  res.render("list", { list: rows, category, page: 1, totalPage: 1, user: req.session.user });
};

// 글 보기
exports.view = async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;

  await db.query("UPDATE board SET views = views + 1 WHERE id=?", [id]);

  const [[post]] = await db.query(
    "SELECT board.*, users.username FROM board JOIN users ON board.user_id = users.id WHERE board.id=?",
    [id]
  );

  const [comments] = await db.query(
    `SELECT comments.*, users.username 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE board_id=? ORDER BY id ASC`,
    [id]
  );

  res.render("view", { post, category, comments, user: req.session.user });
};

// 글쓰기 폼
exports.writeForm = (req, res) => {
  res.render("write", { category: req.params.category, user: req.session.user });
};

// 글쓰기 처리 (이미지 제거)
exports.write = async (req, res) => {
  const category = req.params.category;
  const { title, content } = req.body;

  await db.query(
    `INSERT INTO board (user_id, category, title, content)
     VALUES (?, ?, ?, ?)`,

    [req.session.user.id, category, title, content]
  );

  res.redirect(`/board/${category}`);
};

// 수정 폼
exports.editForm = async (req, res) => {
  const id = req.params.id;

  const [[post]] = await db.query("SELECT * FROM board WHERE id=?", [id]);

  if (post.user_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.send("<script>alert('수정 권한이 없습니다.'); history.back();</script>");
  }

  res.render("edit", { post, category: req.params.category, user: req.session.user });
};

// 수정 처리 (이미지 제거)
exports.edit = async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;
  const { title, content } = req.body;

  const [[old]] = await db.query("SELECT * FROM board WHERE id=?", [id]);

  if (old.user_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.send("<script>alert('수정 권한이 없습니다.'); history.back();</script>");
  }

  await db.query(
    `UPDATE board SET title=?, content=?, updated_at=NOW() WHERE id=?`,
    [title, content, id]
  );

  res.redirect(`/board/${category}/view/${id}`);
};

// 삭제
exports.delete = async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;

  const [[post]] = await db.query("SELECT * FROM board WHERE id=?", [id]);

  if (post.user_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.send("<script>alert('삭제 권한이 없습니다.'); history.back();</script>");
  }

  await db.query("DELETE FROM board WHERE id=?", [id]);

  res.redirect(`/board/${category}`);
};
