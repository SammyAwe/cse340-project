const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const invController = {}

invController.buildByTypeId = async function (req, res, next) {
  try {
    const typeId = req.params.typeId
    const data = await invModel.getVehiclesByType(typeId)
    const nav = await utilities.getNav()
     
    res.render("inventory/type-view", {
      title: "Vehicles",
      nav,
      vehicles: data.rows
    })
  } catch (error) {
    console.error("invController.buildByTypeId error:", error)
    next(error)
  }
}

invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const result = await invModel.getVehicleById(invId)
    if (!result || !result.rows || result.rows.length === 0) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }
    const vehicle = result.rows[0]
    const nav = await utilities.getNav()
    const vehicleHtml = utilities.buildVehicleDetailHTML(vehicle)

    res.render("inventory/detail-view", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      vehicleHtml
    })
  } catch (error) {
    console.error("invController.buildVehicleDetail error:", error)
    next(error)
  }
}

module.exports = invController
