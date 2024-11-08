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

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err.stack);
        return;
    }
    console.log("Connected to database.");
});


app.post('/reg', async (req, res) => {
    const { name, email,  password, gmail_password, faculty, cv_link } = req.body;
   
   
    try {
        await db.query('INSERT INTO profesorii_neverificati SET ?', {
            faculty: faculty,
            email: email,
            name: name,
            password: password,
            gmail_password: gmail_password,
            entered: 0,
            cv_link: cv_link,
            prof:1 
        });

        res.json({
            message: 'Profesorul a fost înregistrat cu succes!'
        });
    } catch (error) {
        console.error('Error la înregistrare:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Email-ul este deja înregistrat.' });
        } else {
            res.status(500).json({ message: 'Eroare la server.' });
        }
    }
});



app.post('/reg_stud', async (req, res) => {

    const { name, email, pass, gmail_pass, faculty, program } = req.body;
    console.log('numeee ',name);
    try {
        
        await db.query('INSERT INTO studentii SET ?', {
            Faculty: faculty,
            ProgramStudy: program,
            name: name,
            email: email,
            pass: pass,
            gmail_pass: gmail_pass,
            prof: 0 
        });

        
        res.json({
            message: 'Studentul a fost înregistrat cu succes!',

        });
    } catch (error) {
        console.error('Error la înregistrare:', error);
        res.status(500).json({ message: 'Eroare la server.' });
    }
});



app.post('/login', (req, res) => {
    const { email, password,pass } = req.body;
    
   
    const sqlStudent = "SELECT * FROM studentii WHERE email = ?";
    db.query(sqlStudent, [email], (err, studentResults) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: "Database Error" });
        }

        if (studentResults.length > 0) {
            const user = studentResults[0];
           
           
            if (pass) {
                if (email === user.email) {
                    console.log('Student is logged with Gmail');
                    return res.json({ success: true, user: { 
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        faculty: user.Faculty,
                        program: user.ProgramStudy,
                        prof: user.prof 
                    }});
                } else {
                    return res.status(401).json({ success: false, message: "Invalid email for Gmail login" });
                }
            } 
            
            else if (password === user.pass) {
                console.log('Student is logged with password');
                return res.json({ success: true, user: { 
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    faculty: user.Faculty,
                    program: user.ProgramStudy,
                    prof: user.prof 
                }});
            } else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
        }

        const sqlProfessor = "SELECT * FROM profesorii_neverificati WHERE email = ?";
        db.query(sqlProfessor, [email], (err, professorResults) => {
            if (err) {
                console.error("Database Error: ", err);
                return res.status(500).json({ error: "Database Error" });
            }

            if (professorResults.length > 0) {
                const user = professorResults[0];
               
                
                if (pass) {
                    if (email === user.email) {
                        console.log('Professor is logged with Gmail');
                        return res.json({ success: true, user: { 
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            faculty: user.Faculty,
                            program: user.ProgramStudy,
                            prof: user.prof 
                        }});
                    } else {
                        return res.status(401).json({ success: false, message: "Invalid email for Gmail login" });
                    }
                } 
               
                else if (password === user.password) {
                    console.log('Professor is logged with password');
                    return res.json({ success: true, user: { 
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        faculty: user.Faculty,
                        program: user.ProgramStudy,
                        prof: user.prof 
                    }});
                } else {
                    return res.status(401).json({ success: false, message: "Invalid password" });
                }
            }

            return res.status(401).json({ success: false, message: "User does not exist" });
        });
    });
});


app.post('/add_form', (req, res) => {
    const { title, faculty, study_program, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email } = req.body;

    const sql = "INSERT INTO theses (title, faculty, study_program, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, faculty, study_program, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email];
   
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error: ", err); 
            return res.status(500).json({ error: "Database Error", details: err });
        }
        return res.status(201).json({ success: true, data: result });
    });
});






app.get('/thesisinfo', (req, res) => {
    const id_stud = req.query.id_stud; 
    

    if (!id_stud) {
        return res.status(400).json({ error: "id_stud is required" });
    }

    const sql = 'SELECT * FROM Applies WHERE Applies.id_stud = ?';

    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});




app.post('/thesisinfo', (req, res) => {
    const {
        title,
        id_thesis,
        id_prof,
        prof_name,
        id_stud,
        stud_name,
        faculty,
        student_program,
        stud_email,
        prof_email,
        applied_data,
    } = req.body;

    
    const appliedDate = new Date(applied_data);
    const formattedDate = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}-${String(appliedDate.getDate()).padStart(2, '0')} ${String(appliedDate.getHours()).padStart(2, '0')}:${String(appliedDate.getMinutes()).padStart(2, '0')}:${String(appliedDate.getSeconds()).padStart(2, '0')}`;


   console.log(id_stud,id_thesis);
    const checkSql = `SELECT COUNT(*) as count FROM Applies WHERE id_stud = ? AND id_thesis = ?`;
    db.query(checkSql, [id_stud, id_thesis], (err, results) => {
        if (err) {
            console.error('Error checking application existence:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const applicationCount = results[0].count;
        console.log(results[0].count);
        if (applicationCount > 0) {
            return res.status(400).json({ error: 'You have already applied for this thesis.' });
        }

      
        const sql = `INSERT INTO Applies (title, id_thesis, id_prof, prof_name, id_stud, stud_name, faculty, student_program, stud_email, prof_email, applied_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [title, id_thesis, id_prof, prof_name, id_stud, stud_name, faculty, student_program, stud_email, prof_email, formattedDate];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ error: 'Database error' });
            }
           
            res.status(201).json({ message: 'Application submitted successfully', id: result.insertId });
        });
    });
});



//----------------------------------------------------MainPage request to backend---------------------
//----------------------------------------------------MainPage request to backend---------------------
//----------------------------------------------------MainPage request to backend---------------------


app.post('/prof', (req, res) => {
    const { email } = req.body;
   
    const sqlStudents = "SELECT * FROM studentii WHERE email = ?";
    const sqlProfessors = "SELECT * FROM profesorii_neverificati WHERE email = ?";

    db.query(sqlStudents, [email], (err, results) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: "Database Error" });
        }

        
        if (results.length > 0) {
            const userInfo = results[0];
            return res.json(userInfo);
        }

       
        db.query(sqlProfessors, [email], (err, results) => {
            if (err) {
                console.error("Database Error: ", err);
                return res.status(500).json({ error: "Database Error" });
            }

           
            if (results.length > 0) {
                const userInfo = results[0];
                return res.json(userInfo);
            }

            
            return res.status(404).json({ error: "User not found" });
        });
    });
});


app.get("/prof", (req, res) => {
    const query = "SELECT * FROM theses"; 
    db.query(query, (err, results) => {
        if (err) {
            console.error("Eroare la obținerea lucrărilor:", err);
            return res.status(500).json({ error: "Eroare la obținerea lucrărilor." });
        }
        res.json(results); 
    });
});


app.get("/applies", (req, res) => {
    const query = "SELECT * FROM Applies";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results);  
    });
});


app.delete('/prof/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);
   
    const sql = 'DELETE FROM theses WHERE id = ?';
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });
});


app.delete('/myaply/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);
   
    const sql = 'DELETE FROM Applies WHERE id_thesis = ?';
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });
});


app.delete('/accept/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);
   

    const sql = 'DELETE FROM Applies WHERE id = ?';
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });
});

app.post('/acceptedApplications', (req, res) => {
    const acceptedApplication = req.body;

    
    const {
        id_thesis,
        faculty,
        title,
        id_prof,
        prof_name,
        prof_email,
        stud_id,
        stud_email,
        stud_name,
        stud_program,
        date
    } = acceptedApplication;
    console.log(acceptedApplication);
   
    if (!id_thesis || !faculty || !title || !id_prof || !prof_name || !prof_email || !stud_id || !stud_email || !stud_name || !stud_program || !date) {
        return res.status(400).json({ error: 'Toate câmpurile sunt necesare!' });
    }

   
    const sql = `INSERT INTO AcceptedApplication (id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, date];

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting into AcceptedApplication:', error);
            return res.status(500).json({ error: 'Eroare la inserare în baza de date.' });
        }

        res.status(201).json({ message: 'Aplicația a fost acceptată cu succes!', id: results.insertId });
    });
});






app.delete('/delMyAplication/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);
   

    const sql = 'DELETE FROM Applies WHERE id_thesis = ?';
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });
});

app.get('/Responses/:id', async (req, res) => {
    const studentId = parseInt(req.params.id); 
    const query = "SELECT * FROM AcceptedApplication WHERE stud_id = ?";  
    
    db.query(query, [studentId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});



app.get('/Accepted/:id', async (req, res) => {
    const studentId = parseInt(req.params.id); 
    const query = "SELECT * FROM AcceptedApplication WHERE id_prof = ?";  
    
    db.query(query, [studentId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});

  
app.get('/aplies/:id', async (req, res) => {
    const studentId = parseInt(req.params.id); 
    console.log(studentId);
    const query = "SELECT * FROM Applies WHERE id_prof = ?";  
    
    db.query(query, [studentId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});