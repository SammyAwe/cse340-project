const express = require("express")
const router = express.Router()

const errorController = require("../controllers/errorController")
const baseController = require("../controllers/baseController")

router.use(express.static("public"))
router.use("/css", express.static("public/css"))
router.use("/js", express.static("public/js"))
router.use("/images", express.static("public/images"))

router.get("/", baseController.buildHome)
router.get("/custom", (req, res) => {
  res.render("custom", { title: "Custom Vehicles" })
})
router.get("/sedan", (req, res) => {
  res.render("sedan", { title: "Sedans" })
})
router.get("/suv", (req, res) => {
  res.render("suv", { title: "SUVs" })
})
router.get("/truck", (req, res) => {
  res.render("truck", { title: "Trucks" })
})
router.get("/account", (req, res) => {
  res.render("account", { title: "My Account" })
})

router.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional 500 error for testing purposes")
  } catch (err) {
    err.status = 500
    next(err)
  }
})

module.exports = router