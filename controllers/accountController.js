const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities");


async function buildLogin(req, res) {
  res.render("account/login", {
    title: "Login",
    nav: res.locals.nav,
    errors: null,
    email: "",
  });
}


async function processLogin(req, res) {
  const { account_email, account_password } = req.body;

  try {
    const account = await accountModel.getAccountByEmail(account_email);
    if (!account) {
      return res.render("account/login", {
        title: "Login",
        nav: res.locals.nav,
        errors: ["Email or password is incorrect."],
        email: account_email,
      });
    }

    const validPassword = await bcrypt.compare(account_password, account.account_password);
    if (!validPassword) {
      return res.render("account/login", {
        title: "Login",
        nav: res.locals.nav,
        errors: ["Email or password is incorrect."],
        email: account_email,
      });
    }

    
    const token = jwt.sign(
      {
        account_id: account.account_id,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email,
        account_type: account.account_type, 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
    req.flash("notice", `Welcome back, ${account.account_firstname}!`);
    res.redirect("/account/management");
  } catch (error) {
    console.error("processLogin error:", error);
    res.render("account/login", {
      title: "Login",
      nav: res.locals.nav,
      errors: ["An error occurred. Please try again."],
      email: account_email,
    });
  }
}


async function buildRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    nav: res.locals.nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}


async function processRegister(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    
    const existing = await accountModel.getAccountByEmail(account_email);
    if (existing) {
      return res.render("account/register", {
        title: "Register",
        nav: res.locals.nav,
        errors: ["Email is already registered."],
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    
    const hashedPassword = await bcrypt.hash(account_password, 10);

    
    const newAccount = await accountModel.registerAccount({
      account_firstname,
      account_lastname,
      account_email,
      account_password: hashedPassword,
    });

    if (!newAccount) {
      return res.render("account/register", {
        title: "Register",
        nav: res.locals.nav,
        errors: ["Registration failed. Try again."],
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    req.flash("notice", "Registration successful! Please log in.");
    res.redirect("/account/login");
  } catch (error) {
    console.error("processRegister error:", error);
    res.render("account/register", {
      title: "Register",
      nav: res.locals.nav,
      errors: ["An error occurred. Please try again."],
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}


async function buildAccountManagement(req, res) {
  const account = res.locals.accountData;
  const nav = await utilities.buildNav();

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    account,
    loggedin: res.locals.loggedin,
  });
}


async function buildUpdateAccount(req, res) {
  const account = await accountModel.getAccountById(req.params.id);
  res.render("account/update", { title: "Update Account", account, errors: null });
}

async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const updated = await accountModel.updateAccount({ account_id, account_firstname, account_lastname, account_email });

  req.flash("notice", updated ? "Account info updated successfully." : "Failed to update account info.");
  res.redirect("/account/management");
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;
  const hashed = await bcrypt.hash(account_password, 10);
  const updated = await accountModel.updatePassword(account_id, hashed);

  req.flash("notice", updated ? "Password updated successfully." : "Failed to update password.");
  res.redirect("/account/management");
}


async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  processLogin,
  buildRegister,
  processRegister,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccountInfo,
  updatePassword,
  logout,
};