const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

router.get("/type/:typeId", invController.buildByTypeId);

router.get("/detail/:invId", invController.buildVehicleDetail);

router.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional server error for testing (500)");
  } catch (err) {
    next(err); 
  }
});

module.exports = router;
