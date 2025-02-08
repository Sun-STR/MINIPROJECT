// File: server.js
const mysql = require('mysql2/promise'); // ใช้ mysql2/promise
const config = require('./config');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = config.express.port;
const bcrypt = require('bcrypt');

// สร้าง Connection Pool
const pool = mysql.createPool({
  host: config.mysql.host,
  port: config.mysql.port,
  database: config.mysql.database,
  user: config.mysql.user,
  password: config.mysql.password,
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
});

// Test database connection
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successfully!');
    connection.release(); // คืน connection กลับสู่ pool
  } catch (err) {
    console.error('Database connection error!', err);
    process.exit(1); // หยุด server หาก connect ไม่ได้
  }
};
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
	const { user, pass } = req.body;
	console.log("Username:", user);  
    console.log("Password:", pass); 
  
	try {
	  const [results] = await pool.query("SELECT * FROM users WHERE username = ? AND password = ?", [user, pass]);
	  if (results.length > 0) {
		res.json({ success: true, message: "Login successful" });
	  } else {
		res.status(401).json({ success: false, message: "Invalid username or password" });
	  }
	} catch (err) {
	  res.status(500).json({ success: false, message: "Login failed", details: err.message });
	}
  });

   // Register API
   app.post('/register', async (req, res) => {
    const { user, pass } = req.body;
    console.log("Username:", user);  
    console.log("Password:", pass); 
  
    if (!user || !pass) {
      return res.status(400).json({ success: false, message: "Fill Username and Password" });
    }
  
    const registerSQL = "INSERT INTO users (username, password) VALUES (?, ?)";
  
    try {

      const [results] = await pool.query(registerSQL, [user, pass]);

      res.status(201).json({ success: true});
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ success: false, message: "Unexpected error occurred." });
    }
  });
  
// Start server
app.listen(port, () => {
    console.log('Server is running on port ${port}');  // ใช้ string template ที่ถูกต้อง
  });  

app.get("/olympics2024", async (req, res) => {
	try {
	  const [results] = await pool.query("SELECT * FROM olympics2024");
	  res.json(results);
	} catch (err) {
	  res.status(500).json({ error: "Error fetching olympics2024", details: err.message });
	}
  });
  
app.post('/olympics2024/create/', async (req, res) => {
	const params = req.body;
	const insertSQL = `
	  INSERT INTO olympics2024 (country, athlete, gender,gold,silver,bronze,total_medals) 
	  VALUES (?, ?, ?,?,?,?,?)
	`;
	const readSQL = "SELECT * FROM olympics2024";
  
	try {
	  await pool.query(insertSQL, [
		params.country,
		params.athlete,
		params.gender,
		params.gold,
		params.silver,
		params.bronze,
		params.total_medals,
	  ]);
	  const [results] = await pool.query(readSQL);
	  res.status(200).send(results);
	} catch (err) {
	  console.error('Database error:', err);
	  res.status(500).send("Backend error!");
	}
  });
  
app.put('/olympics2024/update/', async (req, res) => {
	const params = req.body;
	const updateSQL = `
	  UPDATE olympics2024
	  SET country = ?, 
		  athlete = ?, 
		  gender = ? ,
		  gold = ?, 
		  silver = ?, 
		  bronze = ?,
		  total_medals = ? 
	  WHERE ID = ?
	`;
	const readSQL = "SELECT * FROM olympics2024";
  
	try {
	  await pool.query(updateSQL, [
		params.country,
		params.athlete,
		params.gender,
		params.gold,
		params.silver,
		params.bronze,
		params.total_medals,
		params.ID,
	  ]);
	  const [results] = await pool.query(readSQL);
	  res.status(200).send(results);
	} catch (err) {
	  console.error('Database error:', err);
	  res.status(500).send("Backend error!");
	}
  });
  
// DELETE /rights/delete - ลบข้อมูล Right
app.delete('/olympics2024/delete/', async (req, res) => {
	const { ID } = req.body;
	const deleteSQL = "DELETE FROM olympics2024 WHERE ID = ?";
	const readSQL = "SELECT * FROM olympics2024";
  
	try {
	  const [result] = await pool.query(deleteSQL, [ID]);
	  if (result.affectedRows === 0) {
		return res.status(404).json({ error: "olympics2024 not found" });
	  }
	  const [remainingRights] = await pool.query(readSQL);
	  res.status(200).send(remainingRights);
	} catch (err) {
	  console.error('Database error:', err);
	  res.status(500).send("Backend error!");
	}
  });
  
app.post('/olympics2024/search/:searchText', async (req, res) => {
	const { searchText } = req.params;
  
	if (/[^a-zA-Z0-9ก-๙\s]/.test(searchText)) {
	  return res.status(400).json({ error: "Invalid search text" });
	}
  
	const searchSQL = "SELECT * FROM olympics2024 WHERE athlete LIKE ?";
	try {
	  const [results] = await pool.query(searchSQL, [`%${searchText}%`]);
	  res.status(200).json(results);
	} catch (err) {
	  console.error('Database error:', err);
	  res.status(500).json({ error: "Backend error", details: err.message });
	}
  });
