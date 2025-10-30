const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const app = express()

const PORT = process.env.PORT || 3000


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(express.static(path.join(__dirname, "public")))

const staticRoutes = require("./routes/static")
app.use(staticRoutes)


app.get("/", (req, res) => {
  res.render("index", {title: "Home" })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
