const path = require("path");
const { validationResult } = require("express-validator");
const productModel = require("../models/productModel");

async function dashboard(req, res) {
  const page = Number(req.query.page || 1);
  const perPage = 10;

  const { keyword = "", categoryId, status } = req.query;

  const { items, total } = await productModel.getAdminProducts({
    page,
    perPage,
    keyword: keyword || undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    status: status || undefined,
  });

  const pages = Math.ceil(total / perPage);

  res.render("admin/dashboard", {
    items,
    categories: await productModel.getCategories(),
    page,
    pages,
    total,
    query: {
      keyword: keyword || "",
      categoryId: categoryId || "",
      status: status || "",
    },
  });
}

async function showCreateForm(req, res) {
  const categories = await productModel.getCategories();
  res.render("admin/product-form", {
    mode: "create",
    product: null,
    categories,
  });
}

async function createProduct(req, res) {
  const errors = validationResult(req);
  const categories = await productModel.getCategories();

  if (!errors.isEmpty()) {
    return res.status(400).render("admin/product-form", {
      mode: "create",
      product: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category_id: req.body.category_id,
        status: req.body.status,
        image_url: req.file ? `/uploads/${req.file.filename}` : "",
      },
      categories,
      errors: errors.array(),
    });
  }

  const image_url = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.image_url || "";

  const { name, price, description, category_id, status } = req.body;
  await productModel.createProduct({
    name: name.trim(),
    price: Number(price),
    description: description.trim(),
    image_url,
    category_id: Number(category_id),
    status: status || "active",
  });

  res.redirect("/admin");
}

async function showEditForm(req, res) {
  const id = req.params.id;
  const product = await productModel.getProductById(id);
  if (!product) return res.status(404).send("Không tìm thấy sản phẩm");

  const categories = await productModel.getCategories();
  res.render("admin/product-form", {
    mode: "edit",
    product,
    categories,
  });
}

async function updateProduct(req, res) {
  const id = req.params.id;
  const errors = validationResult(req);
  const categories = await productModel.getCategories();

  const existing = await productModel.getProductById(id);
  if (!existing) return res.status(404).send("Không tìm thấy sản phẩm");

  if (!errors.isEmpty()) {
    return res.status(400).render("admin/product-form", {
      mode: "edit",
      product: {
        ...existing,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category_id: req.body.category_id,
        status: req.body.status,
        image_url: req.file
          ? `/uploads/${req.file.filename}`
          : req.body.image_url,
      },
      categories,
      errors: errors.array(),
    });
  }

  const image_url = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.image_url || existing.image_url;

  await productModel.updateProduct(id, {
    name: req.body.name.trim(),
    price: Number(req.body.price),
    description: req.body.description.trim(),
    category_id: Number(req.body.category_id),
    status: req.body.status || "active",
    image_url,
  });

  res.redirect("/admin");
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  await productModel.deleteProduct(id);
  res.json({ ok: true });
}

module.exports = {
  dashboard,
  showCreateForm,
  createProduct,
  showEditForm,
  updateProduct,
  deleteProduct,
};
