const utilities = require("../utilities")

const validateClassification = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []

  if (!classification_name || classification_name.trim().length < 1) {
    errors.push("Classification name is required.")
  }

  if (errors.length > 0) {
    const nav = await utilities.buildNav()
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name
    })
  }

  next()
}



const validateInventory = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  let errors = []

  if (inv_make.length < 3) errors.push("Make must be at least 3 characters.")
  if (inv_model.length < 3) errors.push("Model must be at least 3 characters.")

  const year = Number(inv_year)
  if (isNaN(year) || year < 1900) errors.push("Enter a valid year.")

  if (inv_description.length < 10) errors.push("Description must be at least 10 characters.")
  if (!inv_image) errors.push("Image path is required.")
  if (!inv_thumbnail) errors.push("Thumbnail path is required.")

  const price = Number(inv_price)
  if (isNaN(price) || price < 0) {
    errors.push("Price must be zero or a positive number.")
  }

  const miles = Number(inv_miles)
  if (isNaN(miles) || miles < 0) {
    errors.push("Miles must be zero or a positive number.")
  }

  if (!inv_color) errors.push("Color is required.")
  if (!classification_id) errors.push("You must choose a classification.")

  if (errors.length > 0) {
    const nav = await utilities.buildNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors,
      classificationList,
      ...req.body
    })
  }

  next()
}


module.exports = { 
  validateClassification, 
  validateInventory 
}
