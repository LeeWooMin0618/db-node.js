exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.send("<script>alert('관리자만 가능합니다.'); history.back();</script>");
  }
  next();
};
