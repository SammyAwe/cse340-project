
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")

const utilities = {}


utilities.buildNav = async function () {
  try {
    const classifications = await invModel.getClassifications()
    const items = Array.isArray(classifications) ? classifications : []

    let nav =
      '<ul>' +
      '<li><a href="/" title="Home page">Home</a></li>' +
      '<li><a href="/inv" title="Vehicle Management">New Car</a></li>'

    items.forEach((row) => {
      nav += `
        <li>
          <a href="/inv/type/${row.classification_id}" 
             title="See our inventory of ${row.classification_name}">
            ${row.classification_name}
          </a>
        </li>`
    })

    nav += "</ul>"
    return nav
  } catch (error) {
    console.error("buildNav error:", error)

    return `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inv">Vehicle Management</a></li>
        <li><a href="#">Error Loading Categories</a></li>
      </ul>
    `
  }
}


utilities.handleJWT = (req, res, next) => {
  res.locals.loggedin = false
  res.locals.accountData = null

  const token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.loggedin = true
      res.locals.accountData = decoded
    } catch (err) {
      res.locals.loggedin = false
      res.locals.accountData = null
    }
  }

  next()
}


utilities.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = utilities
