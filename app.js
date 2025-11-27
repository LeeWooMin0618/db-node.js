const express = require("express");
const session = require("express-session");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const app = express();


const authRouter = require("./routes/auth");
const boardRouter = require("./routes/board");
const commentRouter = require("./routes/comment");

// EJS 템플릿 엔진
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// express-ejs-layouts 설정 추가
app.use(expressLayouts);
app.set("layout", "layout"); // views/layout.ejs 기본 레이아웃 지정


// 미들웨어
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// 세션 설정
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// 모든 뷰에서 user 사용 가능하도록 미들웨어
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 라우터
app.use("/auth", authRouter);
app.use("/board", boardRouter);
app.use("/comment", commentRouter);

// 메인 페이지 → 자유게시판으로 이동
app.get("/", (req, res) => res.redirect("/board/free"));

app.listen(3000, () => console.log("Server started on http://localhost:3000"));


