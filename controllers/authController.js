const db = require("../config/db");
const bcrypt = require("bcrypt");

// 로그인 폼
exports.loginForm = (req, res) => {
  res.render("login");
};

// 로그인 처리
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);

  if (rows.length === 0)
    return res.send("<script>alert('존재하지 않는 사용자입니다.'); history.back();</script>");

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);

  if (!ok)
    return res.send("<script>alert('비밀번호가 틀렸습니다.'); history.back();</script>");

  // 세션 저장
  req.session.user = {
    id: user.id,
    username: user.username,
    is_admin: user.is_admin
  };

  res.redirect("/board/free");
};

// 회원가입 폼
exports.registerForm = (req, res) => {
  res.render("register");
};

// 회원가입 처리
exports.register = async (req, res) => {
  const { username, password } = req.body;

  const [exists] = await db.query("SELECT * FROM users WHERE username=?", [username]);

  if (exists.length > 0)
    return res.send("<script>alert('이미 존재하는 아이디입니다.'); history.back();</script>");

  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (username, password, is_admin) VALUES (?, ?, false)",
    [username, hashed]
  );

  res.send("<script>alert('회원가입 완료! 로그인 해주세요.'); location.href='/auth/login';</script>");
};

// 로그아웃
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
