const invModel = require("../models/inventory-model")

async function buildNav() {
  const data = await invModel.getClassifications()

  let nav =
    '<ul>' +
    '<li><a href="/" title="Home page">Home</a></li>' +
    '<li><a href="/inv" title="Vehicle Management">New Car</a></li>'

  data.rows.forEach((row) => {
    nav += `<li><a href="/inv/type/${row.classification_id}"
              title="See our inventory of ${row.classification_name}">
              ${row.classification_name}</a></li>`
  })

  nav += "</ul>"

  return nav
}

module.exports = {
  buildNav
}
