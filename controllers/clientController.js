const productModel = require("../models/productModel");

async function home(req, res) {
  res.redirect("/client");
}

async function listProducts(req, res) {
  const keyword = (req.query.keyword || "").toString().trim();
  const categoryId = req.query.category ? Number(req.query.category) : null;

  const [products, categories] = await Promise.all([
    productModel.getProducts({
      keyword: keyword || undefined,
      categoryId,
      status: "active",
      limit: 100,
      offset: 0,
    }),
    productModel.getCategories(),
  ]);

  res.render("client/index", {
    products,
    categories,
    keyword: keyword || "",
    selectedCategoryId: categoryId,
  });
}

module.exports = {
  home,
  listProducts,
};
