
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const validation = require("../middleware/validationMiddleware");
const { checkEmployee } = require("../middleware/checkEmployee");

// Management
router.get("/", checkEmployee, invController.buildManagement);

// Vehicles by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Vehicle details
router.get("/detail/:invId", invController.buildVehicleDetail);

// Add classification
router.get("/add-classification", checkEmployee, invController.buildAddClassification);
router.post("/add-classification",
  checkEmployee,
  validation.validateClassification,
  invController.createClassification
);

// Add inventory
router.get("/add-inventory", checkEmployee, invController.buildAddInventory);
router.post("/add-inventory",
  checkEmployee,
  validation.validateInventory,
  invController.createInventory
);

// Delete vehicle
router.get("/delete/:inv_id", checkEmployee, invController.buildDeleteVehicle);
router.post("/delete", checkEmployee, invController.deleteVehicle);

// Delete classification
router.get("/classification/delete/:id", checkEmployee, invController.buildDeleteClassification);
router.post("/classification/delete", checkEmployee, invController.deleteClassification);

module.exports = router;