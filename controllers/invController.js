const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.buildNav()
    const data = await invModel.getClassifications() 

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications: data.rows
    })
  } catch (error) {
    next(error)
  }
}



async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.buildNav()

    if (!data || data.length === 0) {
      return res.status(404).render("inventory/type-view", {
        title: "No Vehicles Found",
        nav,
        errors: null,
        message: "No vehicles exist for this classification.",
        data: []
      })
    }

    res.render("inventory/type-view", {
      title: `${data[0].classification_name} Vehicles`,
      nav,
      errors: null,
      message: null,
      data
    })
  } catch (error) {
    next(error)
  }
}


async function buildVehicleDetail(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    const vehicle = await invModel.getInventoryById(inv_id)
    const nav = await utilities.buildNav()

    if (!vehicle) {
      return res.status(404).render("inventory/detail-view", {
        title: "Vehicle Not Found",
        nav,
        errors: null,
        vehicleHtml: "<p>No vehicle found.</p>"
      })
    }

    const vehicleHtml = `
      <section class="vehicle-detail">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        <p><strong>Price:</strong> $${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat().format(vehicle.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><a href="/inv/delete/${vehicle.inv_id}" class="delete-link">Delete Vehicle</a></p>
      </section>
    `

    res.render("inventory/detail-view", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      errors: null,
      vehicleHtml
    })
  } catch (error) {
    next(error)
  }
}


async function buildAddClassification(req, res, next) {
  const nav = await utilities.buildNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: ""
  })
}


async function createClassification(req, res, next) {
  const { classification_name } = req.body
  const nav = await utilities.buildNav()

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `${classification_name} classification successfully created.`)
    return res.redirect("/inv")
  }

  req.flash("notice", "Failed to create classification. Try again.")
  return res.status(500).render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name
  })
}


async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.buildNav()
    const data = await invModel.getClassifications()

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classifications: data,

      
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    })
  } catch (error) {
    next(error)
  }
}


async function createInventory(req, res, next) {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const nav = await utilities.buildNav()
  const data = await invModel.getClassifications()

  const result = await invModel.addInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  })

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} added successfully.`)
    return res.redirect("/inv")
  }

  req.flash("notice", "Failed to add vehicle.")
  return res.status(500).render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classifications: data,

    
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  })
}


async function buildDeleteVehicle(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const vehicle = await invModel.getInventoryById(inv_id)

  if (!vehicle) {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv/")
  }

  res.render("inventory/delete-confirm", {
    title: "Delete " + vehicle.inv_make + " " + vehicle.inv_model,
    nav: await utilities.buildNav(),
    vehicle
  })
}


async function deleteVehicle(req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const result = await invModel.deleteVehicle(inv_id)

  if (result) {
    req.flash("notice", "Vehicle deleted successfully.")
    return res.redirect("/inv/")
  }

  req.flash("notice", "Delete failed. Try again.")
  return res.redirect("/inv/")
}


async function buildDeleteClassification(req, res, next) {
  const classification_id = parseInt(req.params.id)
  const nav = await utilities.buildNav()

  const classification = await invModel.getClassificationById(classification_id)

  if (!classification) {
    req.flash("notice", "Classification not found.")
    return res.redirect("/inv")
  }

  res.render("inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    classification
  })
}

async function deleteClassification(req, res, next) {
  const classification_id = parseInt(req.body.classification_id)

  const result = await invModel.deleteClassification(classification_id)

  if (result) {
    req.flash("notice", "Classification deleted successfully.")
    return res.redirect("/inv")
  }

  req.flash("notice", "Delete failed.")
  res.redirect("/inv")
}


module.exports = {
  buildManagement,
  buildByClassificationId,
  buildVehicleDetail,
  buildAddClassification,
  createClassification,
  buildAddInventory,
  createInventory,
  buildDeleteVehicle,
  deleteVehicle,
  buildDeleteClassification,
  deleteClassification

}


