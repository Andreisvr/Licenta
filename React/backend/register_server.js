const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',  
}));

app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_db_licenta"
}); 

app.listen(8081, () => {
    console.log("Listening on port 8081");
});


app.post('/reg', (req, res) => {
    const sql = "INSERT INTO users (email, gmail, name, prof, password, verified, verify_nr) VALUES (?)";
    const values = [
        req.body.email,
        req.body.gmail || false, 
        req.body.name,
        req.body.prof || false, 
        req.body.password, 
        req.body.verified || false,
        req.body.verify_nr || null, 
        
        
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
         
            console.error("Database Error: ", err); 
            return res.status(500).json({ error: "Database Error", details: err });
        }
        return res.json(data);
    });
});




app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
      if (err) {
          console.error("Database Error: ", err);
          return res.status(500).json({ error: "Database Error" });
      }
      
      if (results.length === 0) {
          return res.status(401).json({ success: false, message: "User does not exist" });
      }
      
      const user = results[0];
      
     
      if (password !== user.password) {
          return res.status(401).json({ success: false, message: "Invalid password" });
      }
      
     
      return res.json({ success: true, user });
  });
});

app.post('/add_form', (req, res) => {
    console.log("Database values: ", req.body);

    const { title, faculty, study_program, prof_id, description, requirements, start_date, end_date, state } = req.body;
   
    const sql = "INSERT INTO theses (title, faculty, study_program, prof_id, description, requirements, start_date, end_date, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, faculty, study_program, prof_id, description, requirements, start_date, end_date, state];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error: ", err); 
            return res.status(500).json({ error: "Database Error", details: err });
        }
        return res.status(201).json({ success: true, data: result });
    });
});




