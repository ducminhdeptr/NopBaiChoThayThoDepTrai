const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const upload = require("../middleware/uploadMiddleware");
const adminController = require("../controllers/adminController");

function productValidators() {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Tên sản phẩm không được để trống."),
    body("price")
      .notEmpty()
      .withMessage("Giá không được để trống.")
      .bail()
      .isFloat({ gt: 0 })
      .withMessage("Giá phải lớn hơn 0."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Mô tả không được để trống."),
    body("category_id").notEmpty().withMessage("Vui lòng chọn danh mục."),
  ];
}

router.get("/", adminController.dashboard);
router.get("/", adminController.dashboard);

// CRUD
router.get("/products/new", adminController.showCreateForm);
router.post(
  "/products",
  upload.single("image"),
  productValidators(),
  adminController.createProduct,
);

router.get("/products/:id/edit", adminController.showEditForm);
router.post(
  "/products/:id",
  upload.single("image"),
  productValidators(),
  adminController.updateProduct,
);

router.post("/products/:id/delete", adminController.deleteProduct);

module.exports = router;
