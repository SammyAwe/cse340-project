const pool = require("../database/connection"); 


async function getClassifications() {
  try {
    const sql = `SELECT * FROM public.classification ORDER BY classification_name`;
    const result = await pool.query(sql);
    return result.rows; 
  } catch (error) {
    console.error("getClassifications error:", error);
    return [];
  }
}

async function searchVehicles(keyword) {
  try {
    const term = `%${keyword}%`;
    const sql = `
    SELECT inv.*, c.classification_name
    FROM public.inventory AS inv
    JOIN public.classification AS c
    ON inv.classification_id = c.classification_id
    WHERE inv.inv_make ILIKE $1
    OR inv.inv_model ILIKE $1
    OR inv.inv_description ILIKE $1
    OR inv.inv_color ILIKE $1
    OR c.classification_name ILIKE $1
    ORDER BY inv.inv_make, inv.inv_model;
    `;
    const result = await pool.query(sql, [term]);
    return result.rows;
  } catch (error) {
    console.error ("searchVehicles error:", error);
    return [];
  }
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT inv.*, c.classification_name
      FROM public.inventory AS inv
      JOIN public.classification AS c
        ON inv.classification_id = c.classification_id
      WHERE inv.classification_id = $1
      ORDER BY inv.inv_make, inv.inv_model;
    `;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    return [];
  }
}


async function getInventoryById(inv_id) {
  try {
    const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getInventoryById error:", error);
    return null;
  }
}


async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error:", error);
    return null;
  }
}


async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO public.inventory 
        (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
         inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
    const params = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.classification_id
    ];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error:", error);
    return null;
  }
}


async function deleteVehicle(inv_id) {
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rowCount; 
  } catch (error) {
    console.error("deleteVehicle error:", error);
    return 0;
  }
}

async function getClassificationById(classification_id) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1";
    const result = await pool.query(sql, [classification_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getClassificationById error:", error);
  }
}

async function deleteClassification(classification_id) {
  try {
    const sql = "DELETE FROM classification WHERE classification_id = $1";
    const result = await pool.query(sql, [classification_id]);
    return result.rowCount;
  } catch (error) {
    console.error("deleteClassification error:", error);
  }
}

module.exports = {
  getClassifications,
  searchVehicles,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  deleteVehicle,
  deleteClassification,
  getClassificationById
}


