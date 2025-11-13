require("dotenv").config()
const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

const app = express()

const staticRoutes = require("./routes/static")
const invRoutes = require("./routes/inventory")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")

const { notFoundHandler, errorHandler } = require("./middleware/errorHandler")

const PORT = process.env.PORT || 5500

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.set("layout", "./layouts/layout")
app.use(expressLayouts)

app.use(express.static(path.join(__dirname, "public")))

app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    next()
  } catch (err) {
    next(err)
  }
})


app.use("/", staticRoutes)
app.use("/inv", invRoutes)

app.get("/", baseController.buildHome)

app.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional 500 error for testing purposes")
  } catch (err) {
    err.status = 500
    next(err)
  }
})

app.use((req, res, next) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: `Not Found - ${req.originalUrl}`,
    nav: res.locals.nav,
  })
})

app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(err.status || 500).render("errors/error", {
    title: "500 - Server Error",
    message: err.message || "Something went wrong.",
    nav: res.locals.nav,
  })
})

app.listen(PORT, () => {
  console.log(`🚗 App listening on port ${PORT}`)
})
