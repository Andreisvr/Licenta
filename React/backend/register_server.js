const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");

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
    const { name, email, password, gmail_password, faculty, cv_link } = req.body;
 
    let hashedPassword = '';

    if (password) {
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            console.error('Eroare la criptarea parolei:', error);
            return res.status(500).json({ message: 'Eroare la criptarea parolei.' });
        }
    }

    try {
       
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

        
        res.json({
            message: 'Profesorul a fost înregistrat cu succes!'
        });
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

    const { name, email, pass, gmail_pass, faculty, program } = req.body;
    
    const hashedPassword = await bcrypt.hash(pass, 10); 

    try {
        
        await db.query('INSERT INTO studentii SET ?', {
            Faculty: faculty,
            ProgramStudy: program,
            name: name,
            email: email,
            pass: hashedPassword,
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
                    const isMatch = await bcrypt.compare(password, user.pass);
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
    const { title, faculty, study_program, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email,limita } = req.body;

    const sql = "INSERT INTO theses (title, faculty, study_program, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email,limita) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    const values = [title, faculty, study_program, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email, limita];
   
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
    } = req.body;

    
    const appliedDate = new Date(applied_data);
    const formattedDate = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}-${String(appliedDate.getDate()).padStart(2, '0')} ${String(appliedDate.getHours()).padStart(2, '0')}:${String(appliedDate.getMinutes()).padStart(2, '0')}:${String(appliedDate.getSeconds()).padStart(2, '0')}`;


   //console.log(id_stud,id_thesis);
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
    const query = "SELECT * FROM theses WHERE limita > 0 and state <> 'propouse'";
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
        origin
    } = acceptedApplication;
   
   
    if (!id_thesis || !faculty || !title || !id_prof || !prof_name || !prof_email || !stud_id || !stud_email || !stud_name || !stud_program || !date) {
        return res.status(400).json({ error: 'Toate câmpurile sunt necesare!' });
    }

   
    const sql = `INSERT INTO AcceptedApplication (id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, data,origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    const values = [id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, date,origin];

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
   // console.log("ddd", req.query.id_stud);
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
    const { id_thesis, id_prof, id_stud, date } = req.body;

console.log(id_prof, id_stud, id_thesis);    

    
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
            
            const insertConfirmedQuery = `INSERT INTO confirmed (id_thesis, id_prof, id_stud, date) VALUES (?, ?, ?, ?)`;
            db.query(insertConfirmedQuery, [id_thesis, id_prof, id_stud, date], (err, result) => {
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

                      
                        res.status(201).json({ message: "Application confirmed successfully" });
                    });
                });
            });
        } else {
            res.status(400).json({ message: "Limit has been reached for this thesis" });
        }
    });
});



app.post('/confirmationPropouse', (req, res) => {
    const { id_thesis, id_prof, id_stud, date, origin } = req.body;

    console.log(req.body);

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

        console.log('Insertion into confirmed table successful:', result);

       
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

            res.status(201).json({ 
                message: 'Proposal confirmed and state updated successfully.', 
                confirmedData: result, 
                updatedRows: updateResult.affectedRows 
            });
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
    //console.log('faculta',faculty);
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
    //console.log(req.body);

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
      
        const sql = 'SELECT * FROM theses WHERE id = ?';

    db.query(sql, [id_thesis], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });

    }else if(origin ==='propouse') {
       
   const sql = 'SELECT * FROM Propouses WHERE id = ?';

   db.query(sql, [id_thesis], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
    }

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
            console.log('primul',prof,prof.gmail_password);
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

                console.log('primul',stud,stud.gmail_pass);
                 
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
    
        const hashedPassword = await bcrypt.hash(password, 10); 

        
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
