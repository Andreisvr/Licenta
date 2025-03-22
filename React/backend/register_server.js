const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();


//===================================================================
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'https://frontend-hj0o.onrender.com',
//     credentials: true
// }));

// app.use(express.json());

// const db = mysql.createPool({
//     connectionLimit: 10, 
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// const PORT = process.env.PORT || 8081;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


// db.getConnection((err, connection) => {
//     if (err) {
//         console.error("Database connection failed: ", err.stack);
//         return;
//     }
//     console.log("Connected to database.");
//     connection.release(); 
// });


//-----------------------------------------------------------------------------------------------

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

const db = mysql.createPool({
    connectionLimit: 10, 
    host: "localhost",
    user: "root",
    password: "", 
    database: "user_db_licenta"
});

const PORT = 8081;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: ", err.stack);
        return;
    }
    console.log("Connected to database.");
    connection.release(); 
});

//----------------------------------------------------------------------------

app.get('/Verify_Profesor', (req, res) => {
    const email = req.query.email;

   
    if (!email) {
        return res.status(400).json({ error: "Email-ul este obligatoriu." });
    }

    const query = 'SELECT * FROM profesorii WHERE email = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Eroare la verificarea email-ului:", err);
            return res.status(500).json({ error: "Eroare la server." });
        }

        if (results.length > 0) {
            
            return res.json({ found: true });
        } else {
            
            return res.json({ found: false });
        }
    });
});


app.post('/reg', async (req, res) => {
    const { name, email, password, gmail_password, faculty, cv_link, entered } = req.body;

    let hashedPassword = '';

    try {
       
        if (password) {
          //  const saltRounds = parseInt(process.env.SALT); 
            const saltRounds= 10;
            hashedPassword = await bcrypt.hash(password,  saltRounds);
        }

        
        if (entered === 1) {
           
            await db.query('UPDATE profesorii SET entered = 1 WHERE email = ?', [email]);

          
            await db.query('INSERT INTO profesorii_neverificati SET ?', {
                faculty: faculty,
                email: email,
                name: name,
                password: hashedPassword || password,
                gmail_password: gmail_password,
                entered: 1,
                cv_link: cv_link,
                prof: 1
            });

            res.json({ message: 'Profesorul a fost verificat cu succes!' });
        } else {
            
            await db.query('INSERT INTO profesorii_neverificati SET ?', {
                faculty: faculty,
                email: email,
                name: name,
                password: hashedPassword || password,
                gmail_password: gmail_password,
                entered: 0,
                cv_link: cv_link,
                prof: 1
            });

            res.json({ message: 'Profesorul a fost înregistrat cu succes!' });
        }
    } catch (error) {
        console.error('Eroare la înregistrare:', error);

      
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Email-ul este deja înregistrat.' });
        } else {
            res.status(500).json({ message: 'Eroare la server.' });
        }
    }
});





app.post('/reg_stud', async (req, res) => {

    const { name, email, pass, gmail_pass, faculty, program,year } = req.body;

    let hashedPassword = '';
    if (pass) {
       // const saltRounds = parseInt(process.env.SALT); 
        const saltRounds= 10;
            hashedPassword = await bcrypt.hash(password,  saltRounds);
    }

    
    try {

       
        
        await db.query('INSERT INTO studentii SET ?', {
            Faculty: faculty,
            ProgramStudy: program,
            name: name,
            email: email,
            pass: hashedPassword,
            gmail_pass: gmail_pass,
            prof: 0 ,
            study_year:year
        });

        
        res.json({
            message: 'Studentul a fost înregistrat cu succes!',

        });
    } catch (error) {
        console.error('Error la înregistrare:', error);
        res.status(500).json({ message: 'Eroare la server.' });
    }
});


app.get('/verifica-email_st', (req, res) => {
    const { email } = req.query;  

    const query_2 = 'SELECT * FROM profesorii_neverificati WHERE email = ?';
    db.query(query_2, [email], (err, results) => {
        if (err) {
            console.error("Eroare la verificarea email-ului:", err);
            return res.status(500).json({ error: "Eroare la server." });
        }

        if (results.length > 0) {
           
            return res.json({ exists: true });
        } else {
            
            return res.json({ exists: false });
        }
    });
});


app.get('/verifica-email', (req, res) => {
    const { email } = req.query;  

    const query_2 = 'SELECT * FROM studentii WHERE email = ?';
    db.query(query_2, [email], (err, results) => {
        if (err) {
            console.error("Eroare la verificarea email-ului:", err);
            return res.status(500).json({ error: "Eroare la server." });
        }

        if (results.length > 0) {
           
            return res.json({ exists: true });
        } else {
            
            return res.json({ exists: false });
        }
    });
});


app.post('/login', (req, res) => {
    const { email, password, pass } = req.body;

    const sqlStudent = "SELECT * FROM studentii WHERE email = ?";
    db.query(sqlStudent, [email], async (err, studentResults) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: "Database Error" });
        }

        if (studentResults.length > 0) {
            const user = studentResults[0];

            if (pass) {
                if (email === user.email) {
                    console.log('Student is logged with Gmail');
                    return res.json({ 
                        success: true, 
                        user: { 
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            faculty: user.Faculty,
                            program: user.ProgramStudy,
                            prof: user.prof 
                        }
                    });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid email for Gmail login" });
                }
            }
             if (!pass) {
                const isMatch = await bcrypt.compare(password, user.pass);
                if (isMatch) {
                    console.log('Student is logged with password');
                    return res.json({ 
                        success: true, 
                        user: { 
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            faculty: user.Faculty,
                            program: user.ProgramStudy,
                            prof: user.prof 
                        }
                    });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid password" });
                }
            } else {
                return res.status(400).json({ success: false, message: "Password is required" });
            }
        }

        const sqlProfessor = "SELECT * FROM profesorii_neverificati WHERE email = ?";
        db.query(sqlProfessor, [email], async (err, professorResults) => {
            if (err) {
                console.error("Database Error: ", err);
                return res.status(500).json({ error: "Database Error" });
            }

            if (professorResults.length > 0) {
                const user = professorResults[0];

                if (pass) {
                    if (email === user.email) {
                        console.log('Professor is logged with Gmail');
                        return res.json({ 
                            success: true, 
                            user: { 
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                faculty: user.Faculty,
                                program: user.ProgramStudy,
                                prof: user.prof 
                            }
                        });
                    } else {
                        return res.status(401).json({ success: false, message: "Invalid email for Gmail login" });
                    }
                }

                if (!pass) {
                    
                    const isMatch = await bcrypt.compare(password, user.password);
                  
                    if (isMatch) {
                        console.log('Professor is logged with password');
                        return res.json({ 
                            success: true, 
                            user: { 
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                faculty: user.Faculty,
                                program: user.ProgramStudy,
                                prof: user.prof 
                            }
                        });
                    } else {
                        return res.status(401).json({ success: false, message: "Invalid password" });
                    }
                } else {
                    return res.status(400).json({ success: false, message: "Password is required" });
                }
            }

            return res.status(401).json({ success: false, message: "User does not exist" });
        });
    });
});



app.post('/add_form', (req, res) => {
    const { title, faculty, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email,limita,isLetterRequired } = req.body;
    
   
    const sql = "INSERT INTO theses (title, faculty, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email,limita,isLetterRequired) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    const values = [title, faculty, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email, limita,isLetterRequired];
   
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error: ", err); 
            return res.status(500).json({ error: "Database Error", details: err });
        }
        return res.status(201).json({ success: true, data: result });
    });
});




app.post('/Propouses', (req, res) => {
    const {
        title,
        study_program,
        faculty,
        prof_id,
        prof_name,
        stud_name,
        stud_email,
        description,
        motivation,
        
      
        stud_id,
    } = req.body;

        

       
    if (!title || !study_program || !faculty || !prof_id || !stud_name || !stud_email || !description) {
        return res.status(400).json({ error: 'Toate câmpurile obligatorii trebuie completate.' });
    }
    


    const sql = `
        INSERT INTO Propouses (
            title, study_program, faculty, prof_id, prof_name, 
            stud_name, stud_email, description, motivation, 
            stud_id
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    
    const values = [
        title,
        study_program,
        faculty,
        prof_id,
        prof_name,
        stud_name,
        stud_email,
        description,
        motivation || null,
        stud_id
    ];

    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Eroare la interogarea bazei de date:', err);
            return res.status(500).json({ error: 'Eroare la salvarea datelor în baza de date.' });
        }

        res.status(201).json({ message: 'Propunerea a fost adăugată cu succes.', propouseId: result.insertId });
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
        year,
        coverLetter
    } = req.body;

    
    const appliedDate = new Date(applied_data);
    const formattedDate = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}-${String(appliedDate.getDate()).padStart(2, '0')} ${String(appliedDate.getHours()).padStart(2, '0')}:${String(appliedDate.getMinutes()).padStart(2, '0')}:${String(appliedDate.getSeconds()).padStart(2, '0')}`;


   
    const checkSql = `SELECT COUNT(*) as count FROM Applies WHERE id_stud = ? AND id_thesis = ?`;
    db.query(checkSql, [id_stud, id_thesis], (err, results) => {
        if (err) {
            console.error('Error checking application existence:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const applicationCount = results[0].count;
        
        if (applicationCount > 0) {
            return res.status(400).json({ error: 'You have already applied for this thesis.' });
        }

      
        const sql = `INSERT INTO Applies (title, id_thesis, id_prof, prof_name, id_stud, stud_name, faculty, student_program, stud_email, prof_email, applied_data,study_year,cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        const values = [title, id_thesis, id_prof, prof_name, id_stud, stud_name, faculty, student_program, stud_email, prof_email, formattedDate,year,coverLetter];

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
    const query = "SELECT * FROM theses WHERE limita > 0 and state = 'open'";
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


app.get('/show_My_thesis/:profId', (req, res) => {
    const profId = parseInt(req.params.profId);

    if (isNaN(profId)) {
        return res.status(400).json({ message: "Invalid professor ID" });
    }

    const sql = 'SELECT * FROM theses WHERE prof_id = ?';
    db.query(sql, [profId], (err, results) => {
        if (err) {
            console.error("Error fetching theses:", err);
            return res.status(500).json({ message: 'Error fetching theses' });
        }

        res.status(200).json(results);
    });
});




app.delete('/prof/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);

    const deleteThesis = 'DELETE FROM theses WHERE id = ?';
    const deleteAplies = 'DELETE FROM Applies WHERE id_thesis = ?';
    const deleteFavorites = 'DELETE FROM favorite WHERE id_thesis = ?';
    const deleteAccepted = 'DELETE FROM AcceptedApplication WHERE id_thesis = ?';
    const deleteConfirmed = 'DELETE FROM confirmed WHERE id_thesis = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ message: 'Error getting DB connection' });
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                connection.release();
                return res.status(500).json({ message: 'Error starting transaction' });
            }

            connection.query(deleteThesis, [thesisId], (err, result) => {
                if (err) {
                    console.error("Error deleting thesis:", err);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: 'Error deleting thesis' });
                    });
                }

                if (result.affectedRows === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ message: 'Thesis not found' });
                    });
                }

               
                const deleteQueries = [deleteAplies, deleteFavorites, deleteAccepted, deleteConfirmed];

                let queryIndex = 0;

                function runNextQuery() {
                    if (queryIndex < deleteQueries.length) {
                        connection.query(deleteQueries[queryIndex], [thesisId], (err) => {
                            if (err) {
                                console.error(`Error deleting from ${deleteQueries[queryIndex]}:`, err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: 'Error deleting associated records' });
                                });
                            }
                            queryIndex++;
                            runNextQuery();
                        });
                    } else {
                        connection.commit((err) => {
                            if (err) {
                                console.error("Error committing transaction:", err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: 'Error committing transaction' });
                                });
                            }
                            connection.release();
                            res.status(200).json({ message: 'Thesis and associated records deleted successfully' });
                        });
                    }
                }

                runNextQuery();
            });
        });
    });
});



app.delete('/myaply/:id', (req, res) => {
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



app.patch('/proposalAcceptConfirm/:id', (req, res) => {
    const { id } = req.params;
    const { state } = req.body;

    if (!state || (state !== 'accepted' && state !== 'rejected' && state !== 'confirmed')) {
        return res.status(400).json({ error: 'Invalid state value. Only "accepted" or "rejected", confirmed allowed.' });
    }

    const sql = `
        UPDATE Propouses 
        SET state = ? 
        WHERE id = ?
    `;

    db.query(sql, [state, id], (err, result) => {
        if (err) {
            console.error('Error updating state in the database:', err);
            return res.status(500).json({ error: 'Database error during state update.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proposal not found.' });
        }

        res.status(200).json({ message: `Proposal state updated to "${state}".` });
    });
});


app.patch('/proposaReject/:id', (req, res) => {
    const { id } = req.params;
    const { state } = req.body;

    if (!state || (state !== 'accepted' && state !== 'rejected')) {
        return res.status(400).json({ error: 'Invalid state value. Only "accepted" or "rejected" allowed.' });
    }

    const sql = `
        UPDATE Propouses 
        SET state = ? 
        WHERE id = ?
    `;

    db.query(sql, [state, id], (err, result) => {
        if (err) {
            console.error('Error updating state in the database:', err);
            return res.status(500).json({ error: 'Database error during state update.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proposal not found.' });
        }

        res.status(200).json({ message: `Proposal state updated to "${state}".` });
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
        date,
        origin,
        cover_letter,
    } = acceptedApplication;
   
   
    if (!id_thesis || !faculty || !title || !id_prof || !prof_name || !prof_email || !stud_id || !stud_email || !stud_name || !stud_program || !date) {
        return res.status(400).json({ error: 'Toate câmpurile sunt necesare!' });
    }

   
    const sql = `INSERT INTO AcceptedApplication (id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, data,origin,cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    const values = [id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, date,origin,cover_letter];

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
    
    const query = "SELECT * FROM Applies WHERE id_prof = ?";  
    
    db.query(query, [studentId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});


app.get('/confirmedThesis', (req, res) => {
 
    const id_stud = req.query.id_stud; 
    if (!id_stud) {
        return res.status(400).json({ error: "id_stud is required" });
    }

    const sql = 'SELECT * FROM confirmed WHERE id_stud = ?';

    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


app.get('/confirmed', (req, res) => {
    
     const id_prof = req.query.id_prof; 
     if (!id_prof) {
         return res.status(400).json({ error: "id_stud is required" });
     }
 
     const sql = 'SELECT * FROM confirmed WHERE id_prof = ?';
 
     db.query(sql, [id_prof], (error, results) => {
         if (error) {
             console.error("Error fetching applied theses:", error);
             return res.status(500).json({ error: "Database error" });
         }
         res.json(results);
     });
 });
 
 


app.get('/propoused/:name', async (req, res) => { 
    const profname = req.params.name;; 
   
    const query = "SELECT * FROM Propouses WHERE prof_name = ? and state <> 'accepted'";  

    db.query(query, [profname], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});




//-----------------------------------------------------------------Confirmation from responsed_card-----------

app.post('/confirmation', (req, res) => {
    const { id_thesis, id_prof, id_stud, date, cover_letter } = req.body;

    const checkLimitQuery = `SELECT limita FROM theses WHERE id = ?`;
    db.query(checkLimitQuery, [id_thesis], (err, result) => {
        if (err) {
            console.error("Error fetching thesis limit:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Thesis not found" });
        }

        const thesisLimit = result[0].limita;

        if (thesisLimit > 0) {
            const insertConfirmedQuery = `INSERT INTO confirmed (id_thesis, id_prof, id_stud, date, cover_letter) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertConfirmedQuery, [id_thesis, id_prof, id_stud, date, cover_letter], (err, result) => {
                if (err) {
                    console.error("Error adding confirmed application:", err);
                    return res.status(500).json({ message: "Internal server error" });
                }

                const updateLimitQuery = `UPDATE theses SET limita = limita - 1 WHERE id = ?`;
                db.query(updateLimitQuery, [id_thesis], (err, result) => {
                    if (err) {
                        console.error("Error updating thesis limit:", err);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    const updateStateQuery = `UPDATE theses SET state = 'closed' WHERE limita = 0 AND id = ?`;
                    db.query(updateStateQuery, [id_thesis], (err, result) => {
                        if (err) {
                            console.error("Error updating thesis state:", err);
                            return res.status(500).json({ message: "Internal server error" });
                        }

                        
                        const updateStudentQuery = `UPDATE studentii SET thesis_confirmed = 1 WHERE id = ?`;
                        db.query(updateStudentQuery, [id_stud], (err, result) => {
                            if (err) {
                                console.error("Error updating student thesis_confirmed:", err);
                                return res.status(500).json({ message: "Internal server error" });
                            }

                            res.status(201).json({ 
                                message: "Application confirmed successfully and student thesis_confirmed updated" 
                            });
                        });
                    });
                });
            });
        } else {
            res.status(400).json({ message: "Limit has been reached for this thesis" });
        }
    });
});


app.get("/getProfessor/:id_prof", (req, res) => {
    const { id_prof } = req.params;
   
   
    if (!id_prof) {
        return res.status(400).json({ error: "id_prof is required" });
    }

    const sql = 'SELECT * FROM profesorii_neverificati WHERE id = ?';

    db.query(sql, [id_prof], (error, results) => {
        if (error) {
            console.error("Error fetching professor:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Professor not found" });
        }

        res.json(results[0]); 
    });
});


app.post('/confirmationPropouse', (req, res) => {
    const { id_thesis, id_prof, id_stud, date, origin } = req.body;

    if (!id_thesis || !id_prof || !id_stud || !date || !origin) {
        return res.status(400).json({ error: 'All fields are required: id_thesis, id_prof, id_stud, date, origin.' });
    }

    const insertSql = `
        INSERT INTO confirmed (id_thesis, id_prof, id_stud, date, origin)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [id_thesis, id_prof, id_stud, date, origin], (err, result) => {
        if (err) {
            console.error('Error inserting into confirmed table:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Duplicate entry: This record already exists in the confirmed table.' });
            }
            return res.status(500).json({ error: 'Database error during insertion.' });
        }

        const updateSql = `
            UPDATE Propouses 
            SET state = 'confirmed' 
            WHERE id = ?
        `;

        db.query(updateSql, [id_thesis], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating Propouses table:', updateErr);
                return res.status(500).json({ error: 'Database error during state update.' });
            }

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'Proposal not found in Propouses table.' });
            }

           
            const updateStudentSql = `
                UPDATE studentii 
                SET thesis_confirmed = 1
                WHERE id = ?
            `;

            db.query(updateStudentSql, [id_stud], (studentErr, studentResult) => {
                if (studentErr) {
                    console.error('Error updating students table:', studentErr);
                    return res.status(500).json({ error: 'Database error during student update.' });
                }

                res.status(201).json({ 
                    message: 'Proposal confirmed, state updated, and student thesis_confirmed set to 1.', 
                    confirmedData: result, 
                    updatedRows: updateResult.affectedRows,
                    studentUpdated: studentResult.affectedRows
                });
            });
        });
    });
});



app.post('/send_message_select', (req, res) => {
    const { message, id_stud, id_prof, sender, location } = req.body;

    if (!message || !id_stud || !id_prof || !sender || !location) {
        return res.status(400).json({ error: 'Toate câmpurile sunt necesare' });
    }

    
    const query = `
        INSERT INTO messages_selection (stud_id, prof_id, message, sender, location, date)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    db.query(query, [id_stud, id_prof, message, sender, location], (err, result) => {
        if (err) {
            console.error('Eroare la inserarea mesajului:', err);
            return res.status(500).json({ error: 'Eroare la trimiterea mesajului' });
        }

        res.status(200).json({
            id: result.insertId,
            id_stud: id_stud,
            id_prof: id_prof,
            message: message,
            sender: sender,
            location: location,
            created_at: new Date().toISOString()
        });
    });
});



app.delete('/response/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);
   

    const sql = 'DELETE FROM AcceptedApplication WHERE stud_id = ?';
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


//--------------------------------------------------MyPropuse--------------------------------------------------
//--------------------------------------------------MyPropuse--------------------------------------------------

app.get('/get-professors', (req, res) => {
    const faculty = req.query.faculty;

    if (!faculty) {
        return res.status(400).json({ error: 'Faculty parameter is required' });
    }
   
    const query = `
        SELECT *
        FROM profesorii_neverificati 
        WHERE faculty = ?;
    `;

    db.query(query, [faculty], (err, results) => {
        if (err) {
            console.error('Error fetching professors:', err);
            return res.status(500).json({ error: 'Failed to fetch professors' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No professors available for the specified faculty' });
        }

        res.json(results);
    });
});



app.post('/addProposal', (req, res) => {
    const {
        title,
        description,
        additional_info,
        professor_id,
        motivation,
        user_faculty,
        user_study_program,
        user_id,
        user_name,
        prof_name
    } = req.body;
   

    const query = `
        INSERT INTO proposals 
        (title, description, additional_info, professor_id, argumets, user_faculty, user_study_program, user_id,stud_name,prof_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    db.query(
        query,
        [title, description, additional_info, professor_id, motivation, user_faculty, user_study_program, user_id, user_name, prof_name],
        (err, results) => {
            if (err) {
                console.error('Error inserting proposal:', err);
                res.status(500).json({ message: 'Failed to insert proposal.' });
                return;
            }
            res.status(201).json({ message: 'Proposal submitted successfully!', proposalId: results.insertId });
        }
    );
});


app.get('/getProposals/:userId', async (req, res) => {
    const id_stud = req.params.userId; 
    
    
    if (!id_stud) {
         return res.status(400).json({ error: "id_stud is required" });
    }

    const sql = 'SELECT * FROM Propouses WHERE stud_id = ?';

    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});






app.delete('/withdrawApplication/:id', (req, res) => {
    const { id } = req.params; 
  //  console.log(id)
   
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    
    const query = 'DELETE FROM Propouses WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting proposal:', err);
            return res.status(500).json({ error: 'Failed to withdraw thesis' });
        }

       
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        
        res.status(200).json({ message: 'Thesis withdrawn successfully.' });
    });
});



//--------------------------------------------------Add_To_Favorite--------------------------------------------------
//--------------------------------------------------Add_To_Favorite--------------------------------------------------

app.post('/fav', async (req, res) => {
    const { userId, thesisId } = req.body;
   
   

    if (!userId || !thesisId) {
        return res.status(400).json({ error: 'lipsesc userId sau thesisId' });
    }

    try {
       
        await db.query('INSERT INTO favorite (id_user, id_thesis) VALUES (?, ?)', [userId, thesisId]);
        res.status(200).json({ message: 'Adaugat la favorite' });
    } catch (error) {
        console.error('Eroare la adaugarea în favorite:', error);
        res.status(500).json({ error: 'Eroare de server' });
    }
});


app.delete('/fav', async (req, res) => {
    const { userId, thesisId } = req.body;
  
    if (!userId || !thesisId) {
        return res.status(400).json({ error: 'lipsesc userId sau thesisId' });
    }

    try {
       
        await db.query('DELETE FROM favorite WHERE id_user = ? AND id_thesis = ?', [userId, thesisId]);
        res.status(200).json({ message: 'sters din favorite' });
    } catch (error) {
        console.error('Eroare la ștergerea din favorite:', error);
        res.status(500).json({ error: 'Eroare de server' });
    }
});



app.get('/check', (req, res) => {
    const { userId, thesisId } = req.query;

    const query = `SELECT * FROM favorite WHERE id_user = ? AND id_thesis = ?`;

    db.query(query, [userId, thesisId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            return res.json({ isFavorite: true, data: result[0] });
        } else {
            return res.json({ isFavorite: false });
        }
    });
});


//-------------------------------------------------------UpBar----------------------------------------------
app.get('/count', (req, res) => {
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

   
    const query = `
        SELECT COUNT(*) AS count FROM favorite WHERE id_user = ?;
    `;

    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching favorites:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Send back the count of favorites
        const favoriteCount = results[0].count;
        return res.json({ count: favoriteCount });
    });
});


//-==------------------------------------------------MyConfiremd_thesis----------------------------------------
//-==------------------------------------------------MyConfiremd_thesis----------------------------------------

app.get('/ConfirmInformation/:id_thesis', async (req, res) => {
    const id_thesis = req.params.id_thesis; 
    const origin = req.query.origin; 

   
    if (!id_thesis) {
         return res.status(400).json({ error: "id_thesis is required" });
    }   

    if(origin !=='propouse'){
      
        const sql = 'SELECT title FROM theses WHERE id = ?';

    db.query(sql, [id_thesis], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });

    }else if(origin ==='propouse') {
       
   const sql = 'SELECT title FROM Propouses WHERE id = ?';

   db.query(sql, [id_thesis], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
    }

});


app.get('/ConfirmInformation_Student/:id_stud', async (req, res) => {
    const id_stud = req.params.id_stud; 
   

   
    if (!id_stud) {
         return res.status(400).json({ error: "id_stud is required" });
    }   
   

  
      
        const sql = 'SELECT * FROM studentii WHERE id = ?';

    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });

});



//-==------------------------------------------------Favorite---------------------------------------------------
//-==------------------------------------------------Favorite--------------------------------------------------


app.get("/Favorites/:id_user", (req, res) => {
    const { id_user } = req.params;
    const query = "SELECT id_thesis FROM favorite WHERE id_user = ?";

    db.query(query, [id_user], (err, results) => {
        if (err) {
            console.error("Error fetching favorites:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
       
        res.json(results);
    });
});

app.get("/ThesisDetails/:id_thesis", (req, res) => {
    const { id_thesis } = req.params;
    const query = `
        SELECT  * FROM theses WHERE id = ?`;

    db.query(query, [id_thesis], (err, results) => {
        if (err) {
            console.error("Error fetching thesis details:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Thesis not found." });
        }
      
        res.json(results[0]);
    });
});




//-----Restore Password----------------------------------------------------------------------------------

app.get('/check-email/:email', async (req, res) => {
    const email = req.params.email;

    const queryProf = 'SELECT * FROM profesorii_neverificati WHERE email = ?';
    const queryStud = 'SELECT * FROM studentii WHERE email = ?';

    
    db.query(queryProf, [email], (err, profResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (profResults.length > 0) {
            const prof = profResults[0];
       
            if (prof.gmail_password && prof.gmail_password.trim().length > 0) {
                return res.status(403).json({
                    message: 'Cannot change password. User is logged in with Gmail.',
                });
            }
            return res.status(200).json({
                message: 'Is found as prof',
                table: 'profesorii_neverificati',
            });
        } else {
        
            db.query(queryStud, [email], (err, studResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database error' });
                }

                if (studResults.length > 0) {
                    const stud = studResults[0];

               
                 
                    if (stud.gmail_pass && stud.gmail_password.trim().length > 0) {
                        return res.status(403).json({
                            message: 'Cannot change password. User is logged in with Gmail.',
                        });
                    }
                    return res.status(200).json({
                        message: 'Is found as stud',
                        table: 'studentii',
                    });
                } else {
                    return res.status(404).json({ message: 'Email not found' });
                }
            });
        }
    });
});



app.patch('/update-password', async (req, res) => {
    const { email, password, table } = req.body;

    if (!email || !password || !table) {
        return res.status(400).json({ success: false, message: 'Missing email, password, or table' });
    }

    try {
        const saltRounds= 10;
          //const saltRounds = parseInt(process.env.SALT); 
        const hashedPassword = await bcrypt.hash(password,  saltRounds);
      

        
        const updateQuery =
            table === 'studentii'
                ? 'UPDATE studentii SET pass = ? WHERE email = ?'
                : 'UPDATE profesorii_neverificati SET password = ? WHERE email = ?';

        
        db.query(updateQuery, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error("Database error: ", err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (result.affectedRows > 0) {
                return res.status(200).json({ success: true, message: 'Password updated successfully' });
            } else {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        });
    } catch (error) {
        console.error("Error hashing password: ", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



//----------------------------------------------------------------my_thesis_card_stop/open/modify/MyThesisInfo------------------------

app.patch("/stop_thesis/:id", async (req, res) => {
    const { id } = req.params;
   
    try {
     
      const result = await db.query(
        "UPDATE theses SET state = 'pause' WHERE id = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Thesis not found" });
      }
  
      res.status(200).json({ message: "Thesis state updated to stopped" });
    } catch (error) {
      console.error("Error updating thesis state:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

  app.patch("/open_thesis/:id", async (req, res) => {
    const { id } = req.params;
   
    try {
     
      const result = await db.query(
        "UPDATE theses SET state = 'open' WHERE id = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Thesis not found" });
      }
  
      res.status(200).json({ message: "Thesis state updated to stopped" });
    } catch (error) {
      console.error("Error updating thesis state:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  


  app.get('/thesis/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;
   


    const sql = 'SELECT * FROM theses WHERE id = ?';

    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error geting  thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
 
});



app.patch("/update_thesis/:id", (req, res) => {
    const { id } = req.params; 
    const thesisData = req.body;

    const { title, description, requirements, limita, start_date, end_date } = thesisData;

    const startDate = start_date || new Date(); 
    const endDate = end_date || new Date();

    
    const state = limita == 0 ? "closed" : "open";

    const query = `
      UPDATE theses
      SET title = ?, description = ?, requirements = ?, limita = ?, start_date = ?, end_date = ?, state = ?
      WHERE id = ?
    `;

    db.query(query, [title, description, requirements, limita, startDate, endDate, state, id], (error, results) => {
      if (error) {
        console.error("Error updating thesis:", error);
        return res.status(500).json({ error: "Failed to update thesis" });
      }
      
      if (results.affectedRows > 0) {
        return res.status(200).json({ message: "Thesis updated successfully" });
      } else {
        return res.status(404).json({ message: "Thesis not found" });
      }
    });
});








//-----------------------------------------MyPropouse_Info----------------------------------------------------------------------------------



app.get('/MyPropouse/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;
   
   

    const sql = 'SELECT * FROM Propouses WHERE id = ?';

    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error geting  thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
 
});

app.get('/MyConfirm_Info/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;
   
   

    const sql = 'SELECT * FROM theses WHERE id = ?';

    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error geting  thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
 
});


app.get('/student_info/:id', async (req, res) => {
    const stud_id = req.params.id; 
   
    const sql = 'SELECT * FROM studentii WHERE id = ?'; 
    
    db.query(sql, [stud_id], (error, results) => {
        if (error) {
            console.error("Error fetching student data:", error);
            return res.status(500).json({ error: "Database error" });
        }
        
        if (results.length > 0) {
            res.json(results[0]);  
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    });
});


//---------------------------------------------------------------Aplied_Info--------------------------------
app.get('/Applied_info/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;
   
  

    const sql = 'SELECT * FROM Applies WHERE id = ?';

    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error geting  thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
 
});



app.get('/show_My_applies/:studentId', (req, res) => {
    const profId = parseInt(req.params.studentId);

    if (isNaN(profId)) {
        return res.status(400).json({ message: "Invalid professor ID" });
    }
   

    const sql = 'SELECT * FROM Applies WHERE id_stud = ?';
    db.query(sql, [profId], (err, results) => {
        if (err) {
            console.error("Error fetching theses:", err);
            return res.status(500).json({ message: 'Error fetching theses' });
        }

        res.status(200).json(results);
    });
});


//-------------------------------------StudentChat__My_thesis_page--------------------------------------------

app.get("/get_info_my_th_page/:id", (req, res) => {
    const userId = req.params.id;
    
    db.query("SELECT * FROM confirmed WHERE id_stud = ?", [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(results[0]);
    });
});


app.get("/these_s/:id_thesis/:id_prof", (req, res) => {
    
    const { id_thesis, id_prof } = req.params;
   

    db.query("SELECT * FROM theses WHERE id = ? AND prof_id = ?", [id_thesis, id_prof], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get("/propus_e/:id_stud/:id_thesis", (req, res) => {
    const { id_stud, id_thesis } = req.params;
    
    

    db.query("SELECT * FROM Propouses WHERE stud_id = ? AND id = ?", [id_stud, id_thesis], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get("/profesori_neverificat_i/:id_prof", (req, res) => {
    const { id_prof } = req.params;
   
    db.query("SELECT * FROM profesorii_neverificati WHERE id = ?", [id_prof], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});


app.post('/send_message', (req, res) => {
    const { message, id_stud, id_prof,sender } = req.body;
      
    if (!message || !id_stud || !id_prof) {
      return res.status(400).json({ error: 'Toate câmpurile sunt necesare' });
    }
  
    
    const query = `
      INSERT INTO messages (mesaje, id_stud, id_prof, created_at,sender)
      VALUES (?, ?, ?, NOW(),?)
    `;
  
    db.query(query, [message, id_stud, id_prof,sender], (err, result) => {
      if (err) {
        console.error('Eroare la inserarea mesajului:', err);
        return res.status(500).json({ error: 'Eroare la salvarea mesajului' });
      }
  
      res.status(200).json({ message: 'Mesaj trimis cu succes' });
    });
  });
  

  app.get('/read_messages/:prof_id/:student_id', (req, res) => {
    const { prof_id, student_id } = req.params;
   
   
    const query = `SELECT * FROM messages WHERE id_stud = ? AND id_prof = ? ORDER BY created_at`;
  
    db.query(query, [student_id,prof_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Eroare la obținerea mesajelor' });
      }
      res.json(results); 
    });
  });


  app.get('/read_messages_selection/:prof_id/:student_id', (req, res) => {
    const { prof_id, student_id } = req.params;
    //  console.log(prof_id, student_id);
   
    const query = `SELECT * FROM messages_selection WHERE stud_id = ? AND prof_id = ? ORDER BY date`;
  
    db.query(query, [prof_id,student_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Eroare la obținerea mesajelor' });
      }
      res.json(results); 
    });
  });

  
  app.get('/student_info/:student_id', (req, res) => {
    const {  student_id } = req.params;
   
   
    const query = `SELECT * FROM studentii WHERE id = ? `;
  
    db.query(query, [student_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Eroare la obținerea mesajelor' });
      }
      res.json(results); 
    });
  });





//-------------------------------------Profesor_Chat---------------------------------------------------------

app.get('/get_thesis/:thesis_id', (req, res) => {
    const { thesis_id } = req.params;

    const queryTheses = "SELECT * FROM theses WHERE id = ?";
    const queryPropouses = "SELECT * FROM Propouses WHERE id = ?";

    db.query(queryTheses, [thesis_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Eroare la interogarea theses" });
        }

        if (results.length > 0) {
            return res.json(results); 
        }

        
        db.query(queryPropouses, [thesis_id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Eroare la interogarea Propouses" });
            }

            if (results.length > 0) {
                return res.json(results); 
            } else {
                return res.status(404).json({ message: "Thesis nu a fost găsit în nicio tabelă" });
            }
        });
    });
});


//==================================================Admin_Page================================================


app.get("/getAllTheses", (req, res) => {
    const { faculty } = req.query; 

    if (!faculty) {
        return res.status(400).json({ error: "Trebuie să selectezi o facultate!" });
    }

    const sql = "SELECT * FROM theses WHERE faculty = ?";
    
    db.query(sql, [faculty], (err, result) => {
        if (err) {
            console.error("Eroare la interogarea tezelor:", err);
            return res.status(500).json({ error: "Eroare la preluarea tezelor" });
        }
        res.json(result);
    });
});


app.get("/getStudents", (req, res) => {
    const { faculty } = req.query; 

    if (!faculty) {
        return res.status(400).json({ error: "Trebuie să selectezi o facultate!" });
    }

    const sql = "SELECT * FROM studentii WHERE faculty = ?";
    
    db.query(sql, [faculty], (err, result) => {
        if (err) {
            console.error("Eroare la interogarea studenților:", err);
            return res.status(500).json({ error: "Eroare la preluarea studenților" });
        }
        res.json(result);
    });
});

app.get("/getAllProfessors", (req, res) => {
    const { faculty } = req.query; 

    if (!faculty) {
        return res.status(400).json({ error: "Trebuie să selectezi o facultate!" });
    }

    const sql = "SELECT * FROM profesorii_neverificati WHERE faculty = ?";
    
    db.query(sql, [faculty], (err, result) => {
        if (err) {
            console.error("Eroare la interogarea studenților:", err);
            return res.status(500).json({ error: "Eroare la preluarea studenților" });
        }
        res.json(result);
    });
});


app.get("/getAllConfirmed", (req, res) => {
   
    const sql = "SELECT * FROM confirmed";

    db.query(sql, [], (err, result) => {
        if (err) {
            console.error("Eroare la interogarea studenților:", err);
            return res.status(500).json({ error: "Eroare la preluarea studenților" });
        }
        res.json(result);
    });
});




app.get("/thesis_admin", (req, res) => {
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).json({ error: "Lipseste id-ul tezei." });
    }

    const query = "SELECT * FROM theses WHERE id = ?";
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Eroare la obținerea tezei:", err);
            return res.status(500).json({ error: "Eroare la obținerea tezei." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Teza nu a fost găsită." });
        }

        res.json(results[0]); 
    });
});



app.delete("/thesis_admin", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Thesis ID is missing." });
    }

    const deleteThesis = "DELETE FROM theses WHERE id = ?";
    const deleteAplies = "DELETE FROM Applies WHERE id_thesis = ?";
    const deleteFavorites = "DELETE FROM favorite WHERE id_thesis = ?";
    const deleteAccepted = "DELETE FROM AcceptedApplication WHERE id_thesis = ?";
    const deleteConfirmed = "DELETE FROM confirmed WHERE id_thesis = ?";

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ message: "Error getting DB connection." });
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                connection.release();
                return res.status(500).json({ message: "Error starting transaction." });
            }

            connection.query(deleteThesis, [id], (err, result) => {
                if (err) {
                    console.error("Error deleting thesis:", err);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: "Error deleting thesis." });
                    });
                }

                if (result.affectedRows === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ message: "Thesis not found." });
                    });
                }

                const deleteQueries = [deleteAplies, deleteFavorites, deleteAccepted, deleteConfirmed];
                let queryIndex = 0;

                function runNextQuery() {
                    if (queryIndex < deleteQueries.length) {
                        connection.query(deleteQueries[queryIndex], [id], (err) => {
                            if (err) {
                                console.error(`Error deleting from ${deleteQueries[queryIndex]}:`, err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: "Error deleting associated records." });
                                });
                            }
                            queryIndex++;
                            runNextQuery();
                        });
                    } else {
                        connection.commit((err) => {
                            if (err) {
                                console.error("Error committing transaction:", err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: "Error committing transaction." });
                                });
                            }
                            connection.release();
                            res.status(200).json({ message: "Thesis and associated records deleted successfully." });
                        });
                    }
                }

                runNextQuery();
            });
        });
    });
});



app.delete("/delete_student_admin", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Student ID is missing." });
    }

    const deleteStudent = "DELETE FROM studentii WHERE id = ?";
    const deleteApplies = "DELETE FROM Applies WHERE id_stud = ?";
    const deleteFavorites = "DELETE FROM favorite WHERE id_user = ?";
    const deleteAccepted = "DELETE FROM AcceptedApplication WHERE stud_id = ?";
    const deleteConfirmed = "DELETE FROM confirmed WHERE id_stud = ?";
    const deleteMessages = "DELETE FROM messages WHERE id_stud = ?";

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ error: "Error getting DB connection." });
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                connection.release();
                return res.status(500).json({ error: "Error starting transaction." });
            }

            connection.query(deleteStudent, [id], (err, results) => {
                if (err) {
                    console.error("Error deleting student:", err);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: "Error deleting student." });
                    });
                }

                if (results.affectedRows === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ error: "Student not found." });
                    });
                }

                
                const deleteQueries = [deleteApplies, deleteFavorites, deleteAccepted, deleteConfirmed, deleteMessages];

                let queryIndex = 0;

                function runNextQuery() {
                    if (queryIndex < deleteQueries.length) {
                        connection.query(deleteQueries[queryIndex], [id], (err) => {
                            if (err) {
                                console.error(`Error deleting from ${deleteQueries[queryIndex]}:`, err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: "Error deleting associated records." });
                                });
                            }
                            queryIndex++;
                            runNextQuery();
                        });
                    } else {
                        connection.commit((err) => {
                            if (err) {
                                console.error("Error committing transaction:", err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: "Error committing transaction." });
                                });
                            }
                            connection.release();
                            res.json({ message: "Student and related records successfully deleted." });
                        });
                    }
                }

                runNextQuery();
            });
        });
    });
});


app.put("/Verify_Profesor", (req, res) => {
    const { id, entered } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID-ul profesorului lipsește." });
    }

    if (entered !== 0 && entered !== 1) {
        return res.status(400).json({ error: "Valoare invalidă pentru entered." });
    }

    const query = entered === 0
        ? "UPDATE profesorii_neverificati SET entered = 1 WHERE id = ?"
        : "UPDATE profesorii_neverificati SET entered = 0 WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Eroare la actualizare:", err);
            return res.status(500).json({ error: "Eroare la actualizare." });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Profesorul nu a fost găsit." });
        }

        res.json({ message: "Profesorul a fost verificat cu succes." });
    });
});


app.delete("/delet_profesor_admin", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID-ul profesorului lipsește." });
    }

    const deleteStudent = "DELETE FROM profesorii_neverificati WHERE id = ?";
    const deleteApplies = "DELETE FROM Applies WHERE id_prof = ?";
    const deleteFavorites = "DELETE FROM favorite WHERE id_user = ?";
    const deleteAccepted = "DELETE FROM AcceptedApplication WHERE id_prof = ?";
    const deleteConfirmed = "DELETE FROM confirmed WHERE id_prof = ?";
    const deleteMessages = "DELETE FROM messages WHERE id_prof = ?";

    
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection:", err);
            return res.status(500).json({ error: "Error getting database connection." });
        }

        
        connection.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                return connection.release(() => res.status(500).json({ error: "Error starting transaction." }));
            }

           
            connection.query(deleteStudent, [id], (err, results) => {
                if (err) {
                    console.error("Error deleting from profesorii_neverificati:", err);
                    return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from profesorii_neverificati." })));
                }

                if (results.affectedRows === 0) {
                    return connection.rollback(() => connection.release(() => res.status(404).json({ error: "Profesor not found." })));
                }

               
                connection.query(deleteApplies, [id], (err) => {
                    if (err) {
                        console.error("Error deleting from Applies:", err);
                        return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from Applies." })));
                    }

                    
                    connection.query(deleteFavorites, [id], (err) => {
                        if (err) {
                            console.error("Error deleting from favorite:", err);
                            return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from favorite." })));
                        }

                       
                        connection.query(deleteAccepted, [id], (err) => {
                            if (err) {
                                console.error("Error deleting from AcceptedApplication:", err);
                                return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from AcceptedApplication." })));
                            }

                           
                            connection.query(deleteConfirmed, [id], (err) => {
                                if (err) {
                                    console.error("Error deleting from confirmed:", err);
                                    return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from confirmed." })));
                                }

                                
                                connection.query(deleteMessages, [id], (err) => {
                                    if (err) {
                                        console.error("Error deleting from messages:", err);
                                        return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from messages." })));
                                    }

                                    
                                    connection.commit((err) => {
                                        if (err) {
                                            console.error("Error committing transaction:", err);
                                            return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error committing transaction." })));
                                        }

                                        
                                        connection.release();
                                        res.json({ message: "Profesor and related records successfully deleted." });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});



app.delete('/delete_confirmation_admin', (req, res) => {
    const { id, id_stud } = req.body; 
    
  
    const deleteConfirmedSql = 'DELETE FROM confirmed WHERE id = ?';
    db.query(deleteConfirmedSql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting confirmation:", err);
            return res.status(500).json({ message: 'Error deleting confirmation' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Confirmation not found' });
        }

    
        const updateStudentSql = 'UPDATE studentii SET thesis_confirmed = 0 WHERE id = ?';
        db.query(updateStudentSql, [id_stud], (err, result) => {
            if (err) {
                console.error("Error updating student:", err);
                return res.status(500).json({ message: 'Error updating student' });
            }

            res.status(200).json({ message: 'Confirmation withdrawn and student updated successfully' });
        });
    });
});
