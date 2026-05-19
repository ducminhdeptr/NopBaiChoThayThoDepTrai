const { poolPromise, sql } = require("../config/database");

function escapeLike(str) {
  // SQL Server treats % and _ as wildcards; we keep it simple and rely on wrapping with %...%.
  return str;
}

async function getPool() {
  return poolPromise;
}

async function getProducts({
  categoryId,
  keyword,
  status = "active",
  limit = 12,
  offset = 0,
}) {
  const pool = await getPool();

  const where = [];
  const request = pool.request();

  if (status) {
    where.push("p.status = @status");
    request.input("status", sql.VarChar, status);
  }

  if (categoryId) {
    where.push("p.category_id = @categoryId");
    request.input("categoryId", sql.Int, Number(categoryId));
  }

  if (keyword) {
    where.push("(p.name LIKE @kw OR p.description LIKE @kw)");
    request.input("kw", sql.NVarChar, `%${escapeLike(keyword)}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const requestSql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.description,
      p.image_url,
      p.category_id,
      c.name AS category_name,
      p.status,
      p.created_at
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereSql}
    ORDER BY p.created_at DESC
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY
  `;

  request.input("offset", sql.Int, Number(offset));
  request.input("limit", sql.Int, Number(limit));

  const result = await request.query(requestSql);
  return result.recordset;
}

async function countProducts({ categoryId, keyword, status = "active" }) {
  const pool = await getPool();
  const request = pool.request();

  const where = [];

  if (status) {
    where.push("status = @status");
    request.input("status", sql.VarChar, status);
  }

  if (categoryId) {
    where.push("category_id = @categoryId");
    request.input("categoryId", sql.Int, Number(categoryId));
  }

  if (keyword) {
    where.push("(name LIKE @kw OR description LIKE @kw)");
    request.input("kw", sql.NVarChar, `%${escapeLike(keyword)}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sqlText = `SELECT COUNT(1) AS total FROM products ${whereSql}`;

  const result = await request.query(sqlText);
  return result.recordset[0]?.total || 0;
}

async function getProductById(id) {
  const pool = await getPool();
  const request = pool.request();
  request.input("id", sql.Int, Number(id));

  const sqlText = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.description,
      p.image_url,
      p.category_id,
      c.name AS category_name,
      p.status,
      p.created_at
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = @id
  `;

  const result = await request.query(sqlText);
  return result.recordset[0] || null;
}

async function createProduct({
  name,
  price,
  description,
  image_url,
  category_id,
  status = "active",
}) {
  const pool = await getPool();
  const request = pool.request();

  request.input("name", sql.NVarChar, name);
  request.input("price", sql.Decimal(10, 2), price);
  request.input("description", sql.NVarChar, description);
  request.input("image_url", sql.NVarChar, image_url);
  request.input("category_id", sql.Int, Number(category_id));
  request.input("status", sql.VarChar, status);

  const sqlText = `
    INSERT INTO products (name, price, description, image_url, category_id, status, created_at)
    OUTPUT INSERTED.id AS id
    VALUES (@name, @price, @description, @image_url, @category_id, @status, GETDATE())
  `;

  const result = await request.query(sqlText);
  return { id: result.recordset[0].id };
}

async function updateProduct(
  id,
  { name, price, description, image_url, category_id, status },
) {
  const pool = await getPool();
  const request = pool.request();
  request.input("id", sql.Int, Number(id));

  const sets = [];

  if (name !== undefined) {
    sets.push("name = @name");
    request.input("name", sql.NVarChar, name);
  }
  if (price !== undefined) {
    sets.push("price = @price");
    request.input("price", sql.Decimal(10, 2), price);
  }
  if (description !== undefined) {
    sets.push("description = @description");
    request.input("description", sql.NVarChar, description);
  }
  if (image_url !== undefined) {
    sets.push("image_url = @image_url");
    request.input("image_url", sql.NVarChar, image_url);
  }
  if (category_id !== undefined) {
    sets.push("category_id = @category_id");
    request.input("category_id", sql.Int, Number(category_id));
  }
  if (status !== undefined) {
    sets.push("status = @status");
    request.input("status", sql.VarChar, status);
  }

  if (!sets.length) return;

  const sqlText = `UPDATE products SET ${sets.join(", ")} WHERE id = @id`;
  await request.query(sqlText);
}

async function deleteProduct(id) {
  const pool = await getPool();
  const request = pool.request();
  request.input("id", sql.Int, Number(id));

  await request.query(`DELETE FROM products WHERE id = @id`);
}

async function getCategories() {
  const pool = await getPool();
  const result = await pool
    .request()
    .query(
      `SELECT id, name, created_at FROM categories ORDER BY created_at DESC`,
    );
  return result.recordset;
}

// Admin: get paginated products
async function getAdminProducts({
  page = 1,
  perPage = 10,
  keyword,
  categoryId,
  status,
}) {
  const pool = await getPool();
  const request = pool.request();

  const offset = (Number(page) - 1) * Number(perPage);

  const where = [];

  if (status) {
    where.push("p.status = @status");
    request.input("status", sql.VarChar, status);
  }

  if (categoryId) {
    where.push("p.category_id = @categoryId");
    request.input("categoryId", sql.Int, Number(categoryId));
  }

  if (keyword) {
    where.push("(p.name LIKE @kw OR p.description LIKE @kw)");
    request.input("kw", sql.NVarChar, `%${escapeLike(keyword)}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const selectSql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.description,
      p.image_url,
      p.category_id,
      c.name AS category_name,
      p.status,
      p.created_at
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereSql}
    ORDER BY p.created_at DESC
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY
  `;

  request.input("offset", sql.Int, offset);
  request.input("limit", sql.Int, Number(perPage));

  const itemsResult = await request.query(selectSql);

  // total
  // (Reuse same where/params)
  const countSql = `
    SELECT COUNT(1) AS total
    FROM products p
    ${whereSql}
  `;

  const countResult = await pool
    .request()
    .input("offset", sql.Int, offset) // harmless
    .input("limit", sql.Int, Number(perPage)); // harmless

  // rebuild count request properly with same filter inputs
  const countReq = pool.request();
  if (status) countReq.input("status", sql.VarChar, status);
  if (categoryId) countReq.input("categoryId", sql.Int, Number(categoryId));
  if (keyword) countReq.input("kw", sql.NVarChar, `%${escapeLike(keyword)}%`);

  const countRes = await countReq.query(countSql);

  return {
    items: itemsResult.recordset,
    total: countRes.recordset[0]?.total || 0,
    page: Number(page),
    perPage: Number(perPage),
  };
}

module.exports = {
  getProducts,
  countProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getAdminProducts,
};
