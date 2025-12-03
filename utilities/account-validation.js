const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");


function handleValidationErrors(req, res, next, view, stickyData) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render(view, {
      title: "Validation Error",
      nav: res.locals.nav,
      errors: errors.array().map(err => err.msg),
      ...stickyData
    });
  }
  next();
}


const validateRegister = [
  body("account_firstname")
    .trim()
    .notEmpty().withMessage("First name is required.")
    .isLength({ min: 2 }).withMessage("First name must be at least 2 characters."),
  body("account_lastname")
    .trim()
    .notEmpty().withMessage("Last name is required.")
    .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters."),
  body("account_email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Must be a valid email address.")
    .custom(async (email) => {
      const existing = await accountModel.getAccountByEmail(email);
      if (existing) {
        throw new Error("Email is already registered.");
      }
      return true;
    }),
  body("account_password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/\d/).withMessage("Password must contain a number.")
    .matches(/[A-Za-z]/).withMessage("Password must contain a letter."),
  (req, res, next) => {
    handleValidationErrors(req, res, next, "account/register", req.body);
  }
];


const validateLogin = [
  body("account_email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Must be a valid email."),
  body("account_password")
    .notEmpty().withMessage("Password is required."),
  (req, res, next) => {
    handleValidationErrors(req, res, next, "account/login", { email: req.body.account_email });
  }
];


const validateAccountUpdate = [
  body("account_firstname")
    .trim()
    .notEmpty().withMessage("First name is required."),
  body("account_lastname")
    .trim()
    .notEmpty().withMessage("Last name is required."),
  body("account_email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Must be a valid email.")
    .custom(async (email, { req }) => {
      const existing = await accountModel.getAccountByEmail(email);
      if (existing && existing.account_id != req.body.account_id) {
        throw new Error("Email is already registered.");
      }
      return true;
    }),
  (req, res, next) => {
    handleValidationErrors(req, res, next, "account/update", req.body);
  }
];


const validatePasswordUpdate = [
  body("account_password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/\d/).withMessage("Password must contain a number.")
    .matches(/[A-Za-z]/).withMessage("Password must contain a letter."),
  (req, res, next) => {
    handleValidationErrors(req, res, next, "account/update", req.body);
  }
];

module.exports = {
  validateRegister,
  validateLogin,
  validateAccountUpdate,
  validatePasswordUpdate
};