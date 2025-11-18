const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const validation = require("../middleware/validationMiddleware")

router.get("/", invController.buildManagement)

router.get("/type/:classificationId", invController.buildByClassificationId)

router.get("/detail/:invId", invController.buildVehicleDetail)

router.get("/add-classification", invController.buildAddClassification)
router.post("/add-classification",
  validation.validateClassification,
  invController.createClassification
)

router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory",
  validation.validateInventory,
  invController.createInventory
)

router.get("/delete/:inv_id", invController.buildDeleteVehicle);
router.post("/delete", invController.deleteVehicle);

module.exports = router
