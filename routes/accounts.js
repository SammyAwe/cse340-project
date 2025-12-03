const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const validation = require("../utilities/account-validation")
const utilities = require("../utilities/")
const { checkLogin } = require("../middleware/sessionMiddleware")


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login", validation.validateLogin, utilities.handleErrors(accountController.processLogin))


router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", validation.validateRegister, utilities.handleErrors(accountController.processRegister))


router.get("/management", checkLogin, utilities.handleErrors(accountController.buildAccountManagement))


router.get("/update/:id", checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))
router.post("/update-info", checkLogin, validation.validateAccountUpdate, utilities.handleErrors(accountController.updateAccountInfo))
router.post("/update-password", checkLogin, validation.validatePasswordUpdate, utilities.handleErrors(accountController.updatePassword))


router.get("/logout", checkLogin, utilities.handleErrors(accountController.logout))

module.exports = router