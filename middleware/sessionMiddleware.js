const jwt = require("jsonwebtoken")

function checkJWT(req, res, next) {
  res.locals.loggedin = false
  res.locals.accountData = null

  const token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.accountData = decoded
      res.locals.loggedin = true
    } catch (err) {
      res.locals.accountData = null
      res.locals.loggedin = false
    }
  }

  next()
}


function checkLogin(req, res, next) {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in first.")
    return res.redirect("/account/login")
  }
  next()
}

module.exports = { checkJWT, checkLogin }