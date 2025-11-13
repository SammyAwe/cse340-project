const invModel = require("../models/inventory-model")
const Util = {}

Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.formatNumber = function (num) {
  if (num === null || num === undefined) return ""
  return Number(num).toLocaleString("en-US")
}

Util.formatCurrency = function (amount) {
  if (amount === null || amount === undefined) return ""
  return Number(amount).toLocaleString("en-US", { style: "currency", currency: "USD" })
}


Util.buildVehicleDetailHTML = function (vehicle) {
  if (!vehicle) return "<p>Vehicle details unavailable.</p>"

  const make = vehicle.inv_make || ""
  const model = vehicle.inv_model || ""
  const year = vehicle.inv_year || ""
  const price = Util.formatCurrency(vehicle.inv_price)
  const miles = Util.formatNumber(vehicle.inv_miles)
  const color = vehicle.inv_color || "N/A"
  const description = vehicle.inv_description || ""
  const imagePath = vehicle.inv_image || "/images/site/placeholder.png"

  return `
  <div class="vehicle-detail">
    <div class="vehicle-detail__media">
      <img src="${imagePath}" alt="${make} ${model} ${year}" />
    </div>
    <div class="vehicle-detail__info">
      <h1 class="vehicle-title">${year} ${make} ${model}</h1>
      <p class="vehicle-price">${price}</p>
      <ul class="vehicle-meta">
        <li><strong>Make:</strong> ${make}</li>
        <li><strong>Model:</strong> ${model}</li>
        <li><strong>Year:</strong> ${year}</li>
        <li><strong>Mileage:</strong> ${miles} miles</li>
        <li><strong>Color:</strong> ${color}</li>
      </ul>
      <section class="vehicle-description">
        <h2>Description</h2>
        <p>${description}</p>
      </section>
    </div>
  </div>
  `
}

module.exports = Util
