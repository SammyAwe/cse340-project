
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const validation = require("../middleware/validationMiddleware");
const { checkEmployee } = require("../middleware/checkEmployee");


router.get("/", checkEmployee, invController.buildManagement);

router.get("/search", invController.search);

router.get("/type/:classificationId", invController.buildByClassificationId);


router.get("/detail/:invId", invController.buildVehicleDetail);


router.get("/add-classification", checkEmployee, invController.buildAddClassification);
router.post("/add-classification",
  checkEmployee,
  validation.validateClassification,
  invController.createClassification
);


router.get("/add-inventory", checkEmployee, invController.buildAddInventory);
router.post("/add-inventory",
  checkEmployee,
  validation.validateInventory,
  invController.createInventory
);


router.get("/delete/:inv_id", checkEmployee, invController.buildDeleteVehicle);
router.post("/delete", checkEmployee, invController.deleteVehicle);


router.get("/classification/delete/:id", checkEmployee, invController.buildDeleteClassification);
router.post("/classification/delete", checkEmployee, invController.deleteClassification);

module.exports = router;