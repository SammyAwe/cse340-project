require("dotenv").config()
const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
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


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(express.static(path.join(__dirname, "public")))


app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
)

app.use(flash())


app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})


app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.buildNav()
    next()
  } catch (err) {
    next(err)
  }
})


app.use("/", staticRoutes)
app.use("/inv", invRoutes)

app.get("/", baseController.buildHome)


app.use(notFoundHandler)


app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚗 App listening on port ${PORT}`)
})
