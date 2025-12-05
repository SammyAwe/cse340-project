const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const validateClassification = async (req, res, next) => { 
  const { classification_name } = req.body;
  let errors = [];

  if (!classification_name || classification_name.length === 0) {
    errors.push({ msg: "Classification name is required." });
  }

 
  if (classification_name && classification_name.length < 1) {
    errors.push({ msg: "Classification name must be at least 1 character." });
  }


  if (errors.length > 0) {
    const nav = await utilities.buildNav();

    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name
    });
  }

  next();
};



const validateInventory = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body;

  let errors = [];

  if (!inv_make || inv_make.length < 3)
    errors.push({ msg: "Make must be at least 3 characters." });

  if (!inv_model || inv_model.length < 3)
    errors.push({ msg: "Model must be at least 3 characters." });

  const year = Number(inv_year);
  if (isNaN(year) || year < 1900)
    errors.push({ msg: "Enter a valid year." });

  if (!inv_description || inv_description.length < 10)
    errors.push({ msg: "Description must be at least 10 characters." });

  if (!inv_image)
    errors.push({ msg: "Image path is required." });

  if (!inv_thumbnail)
    errors.push({ msg: "Thumbnail path is required." });

  const price = Number(inv_price);
  if (isNaN(price) || price <= 0)
    errors.push({ msg: "Price must be a positive number." });

  const miles = Number(inv_miles);
  if (isNaN(miles) || miles < 0)
    errors.push({ msg: "Miles must be zero or a positive number." });

  if (!inv_color)
    errors.push({ msg: "Color is required." });

  if (!classification_id)
    errors.push({ msg: "You must choose a classification." });

  if (errors.length > 0) {
    const nav = await utilities.buildNav();
    const classifications = await invModel.getClassifications();

    return res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors,
      classifications,
      ...req.body
    });
  }

  next();
};


module.exports = {
  validateClassification,
  validateInventory
};
