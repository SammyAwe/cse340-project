const pool = require("../database/connection"); 


async function getAccountByEmail(email) {
  try {
    const sql = `SELECT * FROM public.account WHERE account_email = $1`;
    const result = await pool.query(sql, [email]);
    return result.rows[0]; 
  } catch (error) {
    console.error("getAccountByEmail error:", error);
    return null;
  }
}


async function getAccountById(account_id) {
  try {
    const sql = `SELECT * FROM public.account WHERE account_id = $1`;
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error:", error);
    return null;
  }
}


async function registerAccount({ account_firstname, account_lastname, account_email, account_password }) {
  try {
    const sql = `
      INSERT INTO public.account 
        (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    return result.rows[0];
  } catch (error) {
    console.error("registerAccount error:", error);
    return null;
  }
}


async function updateAccount({ account_id, account_firstname, account_lastname, account_email }) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updateAccount error:", error);
    return null;
  }
}


async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updatePassword error:", error);
    return null;
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
  updateAccount,
  updatePassword
};