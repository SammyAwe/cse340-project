const checkEmployee = (req, res, next) => {
  const account = res.locals.accountData;

  if (!account) {
    req.flash("notice", "You must be logged in to access this page.")
    return res.redirect("/account/login")
  }
  if (account.account_type !== "Employee" && account.account_type !== "Admin") {
    req.flash("notice", "You do not have access to this page as a client.")
    return res.redirect("/account")
  }

  next()
  }

module.exports = { checkEmployee };


