const express = require('express');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static("public/css"));
router.use("/js", express.static("public/js"));
router.use("/images", express.static("public/images"));

module.exports = router;

router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});
router.get("/custom", (req, res) => {
    res.render("custom", { title: "Custom Vehicles" });
});
router.get("/sedan", (req, res) => {
    res.render("sedan", { title: "Sedans" });
});
router.get("/suv", (req, res) => {
    res.render("suv", { title: "SUVs" });
});
router.get("/truck", (req, res) => {
    res.render("truck", { title: "Trucks" });
});
router.get("/account", (req, res) => {
    res.render("account", { title: "My Account" });
});

