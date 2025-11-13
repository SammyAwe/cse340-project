const pool = require("../database")

async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getVehiclesByType(classification_id) {
  const sql = `
    SELECT * 
    FROM public.inventory
    WHERE classification_id = $1
    ORDER BY inv_make
  `;
  return await pool.query(sql, [classification_id]);
}

async function getVehicleById(inv_id) {
  const sql = `
    SELECT inv_id, inv_make, inv_model, inv_description, inv_year, inv_price,
           inv_miles, inv_color, classification_id, inv_thumbnail, inv_image
    FROM public.inventory
    WHERE inv_id = $1
  `
  return await pool.query(sql, [inv_id])
}

module.exports = {
  getClassifications,
  getVehiclesByType,
  getVehicleById
};
