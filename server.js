const express = require('express');
const cors=require('cors')
const mysql=require('mysql');
const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"abishek"
})

app.get('/',(req,res)=>{
    const sql="SELECT * FROM empdetails";
    db.query(sql,(err,result)=>{
        if(err) return res.json("error inside server");
        return res.json(result);
      })
})

app.post('/empdetails', (req, res) => {
  const { name, empid,department,designation,project,type,status } = req.body;

  console.log("Received:", req.body);
  if (!name || !empid || !department || !designation  || !project || !type || !status) {
    return res.status(400).send("Missing fields");
  }

  const sql = "INSERT INTO empdetails (name, empid,department,designation,project,type,status) VALUES (?, ?,?,?,?,?,?)";
  const values = [name, empid,department,designation,project,type,status];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Database insert error");
    }
    res.send("Inserted successfully");
  });
});

app.get('/edit/:empid', (req, res) => {
  const empid = req.params.empid;
  const sql = "SELECT * FROM empdetails WHERE empid = ?";
  db.query(sql, [empid], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(result);
  });
});

app.delete('/delete/:empid', (req, res) => {
  const sql = "DELETE FROM empdetails WHERE empid = ?";
  const empid = req.params.empid;

  db.query(sql, [empid], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json("Error inside server");
    }
    return res.json(result);
  });
});
app.put('/update/:empid', (req, res) => {
  const empid = req.params.empid;
  const { name, department, designation, project, type, status } = req.body;

  // ✅ 1. Validate input
  if (!name || !department || !designation || !project || !type || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // ✅ 2. Update query
  const sql = `
    UPDATE empdetails 
    SET name = ?, department = ?, designation = ?, project = ?, type = ?, status = ?
    WHERE empid = ?
  `;
  
  db.query(sql, [name, department, designation, project, type, status, empid], (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({ error: 'Database update failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully' });
  });
});

    app.listen(8081,()=>{
        console.log("port 8081");
    })