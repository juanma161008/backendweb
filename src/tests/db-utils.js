// src/tests/db-utils.js
import { pool } from '../database/database.js';

export const closeConnection = async () => {
  await pool.end();
};