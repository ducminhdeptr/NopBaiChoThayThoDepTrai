const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/client", clientController.listProducts);
router.get("/", clientController.home);

module.exports = router;
