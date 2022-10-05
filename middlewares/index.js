
// authentication function 
const checkIfAuthenticated = function (req, res, next) {
  const user = req.session.user;
  if (!user) {
    req.flash("error_messages", "Only Staff has access privilege");
    res.redirect("/");
  } else {
    next();
  }
};



module.exports = { checkIfAuthenticated};