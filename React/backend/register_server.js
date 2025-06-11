
// Import required modules

const express = require("express");         // Framework for creating the HTTP server
const mysql = require("mysql");             // Module for connecting to MySQL database
const cors = require("cors");               // Middleware to allow cross-origin requests (e.g., between frontend and backend)
const bcrypt = require("bcrypt");           // Module for password hashing
require("dotenv").config();                 // Load environment variables from a .env file

const app = express(); // Initialize Express app

//---------------------------------------------------------------
// Production version (commented)
/*
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://frontend-hj0o.onrender.com', // Allow requests only from specified frontend
    credentials: true // Allow sending cookies
}));

app.use(express.json()); // Middleware to parse JSON in HTTP requests

// Create a MySQL connection pool
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const PORT = process.env.PORT || 8081; // Port the server runs on

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Check database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: ", err.stack); // Display error if connection fails
        return;
    }
    console.log("Connected to database.");
    connection.release(); // Release the connection
});
*/

//---------------------------------------------------------------


// Use CORS with frontend URL from .env
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// Use MySQL connection pool with values from .env
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Check DB connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: ", err.stack);
        return;
    }
    console.log("Connected to database.");
    connection.release();
});


//----------------------------------------------------------------------------

// Route to check if a professor exists based on email
app.get('/Verify_Profesor', (req, res) => {
    const email = req.query.email;

    // If email is not provided, return error
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    // Search in the database for a professor with the given email
    const query = 'SELECT * FROM profesorii WHERE email = ?';
   
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Server error." });
        }

        // If professor exists, return found: true, otherwise false
        return res.json({ found: results.length > 0 });
    });
});


// Register a professor
app.post('/reg', async (req, res) => {
    const { name, email, password, gmail_password, faculty, cv_link, entered } = req.body;

    let hashedPassword = '';

    try {
        // If professor provides a password, hash it
        if (password) {
            const saltRounds = parseInt(process.env.SALT);
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // If professor is already verified (entered === 1)
        if (entered === 1) {
            // Update 'entered' field to 1 in `profesorii` table
            await db.query('UPDATE profesorii SET entered = 1 WHERE email = ?', [email]);

            // Insert into `profesorii_neverificati` table with status "verified"
          
            await db.query('INSERT INTO profesorii_neverificati SET ?', {
             
                faculty, email, name,
                password: hashedPassword || password,
                gmail_password,
                entered: 1,
                cv_link,
                prof: 1
            });

            res.json({ message: 'Professor successfully verified!' });
        } else {
            
             // If not verified, insert with entered: 0
           
            await db.query('INSERT INTO profesorii_neverificati SET ?', {
                faculty, email, name,
                password: hashedPassword || password,
                gmail_password,
                entered: 0,
                cv_link,
                prof: 1
            });

            res.json({ message: 'Professor successfully registered!' });
        }
    } catch (error) {
      
        console.error('Registration error:', error);

        // Handle case where email already exists
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Email is already registered.' });
        } else {
            res.status(500).json({ message: 'Server error.' });
        }
    }
});


// Register a student
app.post('/reg_stud', async (req, res) => {
   
    const { name, email, pass, gmail_pass, faculty, program, year } = req.body;

    let hashedPassword = '';

    // Hash the password if provided
    if (pass) {
        const saltRounds = parseInt(process.env.SALT);
        hashedPassword = await bcrypt.hash(pass, saltRounds);
    }

    try {
        // Insert student data into the database
      
         await db.query('INSERT INTO studentii SET ?', {
            Faculty: faculty,
            ProgramStudy: program,
            name,
            email,
            pass: hashedPassword,
            gmail_pass,
            prof: 0,
            study_year: year
        });

        res.json({ message: 'Student successfully registered!' });
    } catch (error) {
       
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// Check if email exists in `profesorii_neverificati`
app.get('/verifica-email_st', (req, res) => {
    const { email } = req.query;

    const query_2 = 'SELECT * FROM profesorii_neverificati WHERE email = ?';
    db.query(query_2, [email], (err, results) => {
        
         if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Server error." });
        }

        return res.json({ exists: results.length > 0 });
    });
});


// Check if email exists in `studentii`
app.get('/verifica-email', (req, res) => {
    const { email } = req.query;

    const query_2 = 'SELECT * FROM studentii WHERE email = ?';
    db.query(query_2, [email], (err, results) => {
      
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Server error." });
        }

        return res.json({ exists: results.length > 0 });
    });
});



// Login for students and professors (with password or Gmail)
app.post('/login', (req, res) => {
   
    const { email, password, pass } = req.body;

    const sqlStudent = "SELECT * FROM studentii WHERE email = ?";
    
    // Check if the email belongs to a student
    db.query(sqlStudent, [email], async (err, studentResults) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: "Database Error" });
        }

        // If a student with the given email is found
        if (studentResults.length > 0) {
            const user = studentResults[0];

            // Gmail login (no password required, only email check)
            if (pass) {
              
                if (email === user.email) {
                    console.log('Student is logged with Gmail');
                    return res.json({ 
                        success: true, 
                        user: {
                            id: user.id, name: user.name, email: user.email,
                            faculty: user.Faculty, program: user.ProgramStudy, prof: user.prof 
                        }
                    });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid email for Gmail login" });
                }
            }

            // Password login
            if (!pass) {
                const isMatch = await bcrypt.compare(password, user.pass);

                if (isMatch) {
                    console.log('Student is logged with password');
                  
                    return res.json({ 
                        success: true, 
                        user: {
                            id: user.id, name: user.name, email: user.email,
                            faculty: user.Faculty, program: user.ProgramStudy, prof: user.prof 
                        }
                    });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid password" });
                }
            } else {
                return res.status(400).json({ success: false, message: "Password is required" });
            }
        }


        // If not a student, check if the email belongs to a professor
        const sqlProfessor = "SELECT * FROM profesorii_neverificati WHERE email = ?";

        db.query(sqlProfessor, [email], async (err, professorResults) => {
            if (err) {
                console.error("Database Error: ", err);
                return res.status(500).json({ error: "Database Error" });
            }

            // If a professor with the given email is found
            if (professorResults.length > 0) {
                const user = professorResults[0];

                // Gmail login
                if (pass) {
                    if (email === user.email) {
                    
                        console.log('Professor is logged with Gmail');
                        return res.json({ 
                            success: true, 
                            user: {
                                id: user.id, name: user.name, email: user.email,
                                faculty: user.Faculty, program: user.ProgramStudy, prof: user.prof 
                            }
                        });
                    } else {
                        return res.status(401).json({ success: false, message: "Invalid email for Gmail login" });
                    }
                }

                // Password login
                if (!pass) {
                    const isMatch = await bcrypt.compare(password, user.password);
                   
                    if (isMatch) {
                        console.log('Professor is logged with password');
                        return res.json({ 
                            success: true, 
                            user: {
                                id: user.id, name: user.name, email: user.email,
                                faculty: user.Faculty, program: user.ProgramStudy, prof: user.prof 
                            }
                        });
                    } else {
                        return res.status(401).json({ success: false, message: "Invalid password" });
                    }
                } else {
                    return res.status(400).json({ success: false, message: "Password is required" });
                }
            }

            // If the user is neither student nor professor
            return res.status(401).json({ success: false, message: "User does not exist" });
        });
    });
});



// Add a new thesis form (submitted by professor)
app.post('/add_form', (req, res) => {
    const { title, faculty, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email, limita, isLetterRequired } = req.body;

   
    const sql = "INSERT INTO theses (title, faculty, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email, limita, isLetterRequired) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, faculty, prof_id, prof_name, description, requirements, start_date, end_date, state, cv_link, email, limita, isLetterRequired];


    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error: ", err); 
            return res.status(500).json({ error: "Database Error", details: err });
        }
        return res.status(201).json({ success: true, data: result });
    });
});



// Submit a proposal from student to professor
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

    // Check if required fields are provided
    if (!title || !study_program || !faculty || !prof_id || !stud_name || !stud_email || !description) {
        return res.status(400).json({ error: 'All required fields must be filled in.' });
    }


    const sql = `
        INSERT INTO Propouses (
            title, study_program, faculty, prof_id, prof_name, 
            stud_name, stud_email, description, motivation, 
            stud_id
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Error saving data into database.' });
        }

        res.status(201).json({ message: 'Proposal successfully added.', propouseId: result.insertId });
    });
});



// Get applied theses for a student
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



// Submit an application for a thesis
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

    // Format the application date to MySQL DATETIME format
    const appliedDate = new Date(applied_data);
    const formattedDate = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}-${String(appliedDate.getDate()).padStart(2, '0')} ${String(appliedDate.getHours()).padStart(2, '0')}:${String(appliedDate.getMinutes()).padStart(2, '0')}:${String(appliedDate.getSeconds()).padStart(2, '0')}`;

    // Check if the student already applied for the same thesis
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

        // Insert the application into the Applies table
        const sql = `INSERT INTO Applies (title, id_thesis, id_prof, prof_name, id_stud, stud_name, faculty, student_program, stud_email, prof_email, applied_data, study_year, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [title, id_thesis, id_prof, prof_name, id_stud, stud_name, faculty, student_program, stud_email, prof_email, formattedDate, year, coverLetter];

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

// POST route to find a user by email in either students or unverified professors tables
app.post('/prof', (req, res) => {
    const { email } = req.body; // Extract email from the request body
   
    // SQL queries to search for the email in two tables
    const sqlStudents = "SELECT * FROM studentii WHERE email = ?";
    const sqlProfessors = "SELECT * FROM profesorii_neverificati WHERE email = ?";

    // First query: check if the email exists in the students table
    db.query(sqlStudents, [email], (err, results) => {
        if (err) {
            // Handle database error and send 500 response
            console.error("Database Error: ", err);
            return res.status(500).json({ error: "Database Error" });
        }

        // If found in students table, return the user info immediately
        if (results.length > 0) {
            const userInfo = results[0];
            return res.json(userInfo);
        }

        // If not found in students, check the unverified professors table
        db.query(sqlProfessors, [email], (err, results) => {
            if (err) {
                // Handle database error and send 500 response
                console.error("Database Error: ", err);
                return res.status(500).json({ error: "Database Error" });
            }

            // If found in professors table, return the user info
            if (results.length > 0) {
                const userInfo = results[0];
                return res.json(userInfo);
            }

            // If not found in either table, respond with 404 not found
            return res.status(404).json({ error: "User not found" });
        });
    });
});


// GET route to retrieve all open theses where the limit (capacity) is greater than 0
app.get("/prof", (req, res) => {
    const query = "SELECT * FROM theses WHERE limita > 0 and state = 'open'";
    db.query(query, (err, results) => {
        if (err) {
            // Log error and respond with 500 internal server error
            console.error("Eroare la obținerea lucrărilor:", err);
            return res.status(500).json({ error: "Eroare la obținerea lucrărilor." });
        }
        // Return the list of theses as JSON response
        res.json(results); 
    });
});


// GET route to fetch all applications (applies)
app.get("/applies", (req, res) => {
    const query = "SELECT * FROM Applies";
    db.query(query, (err, results) => {
        if (err) {
            // Log error and respond with 500 internal server error
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        // Return all application records as JSON response
        res.json(results);  
    });
});


// GET route to show all theses for a specific professor by professor ID
app.get('/show_My_thesis/:profId', (req, res) => {
    const profId = parseInt(req.params.profId); // Parse professor ID from URL params

    // Validate professor ID, if not a number return 400 bad request
    if (isNaN(profId)) {
        return res.status(400).json({ message: "Invalid professor ID" });
    }

    // SQL query to select theses belonging to the given professor
    const sql = 'SELECT * FROM theses WHERE prof_id = ?';
    db.query(sql, [profId], (err, results) => {
        if (err) {
            // Log error and respond with 500 internal server error
            console.error("Error fetching theses:", err);
            return res.status(500).json({ message: 'Error fetching theses' });
        }

        // Return theses as JSON response
        res.status(200).json(results);
    });
});



// DELETE route to delete a thesis by ID, including all related records in other tables
app.delete('/prof/:id', (req, res) => {
    const thesisId = parseInt(req.params.id); // Parse thesis ID from URL params

    // SQL queries for deleting from theses and all related tables
    const deleteThesis = 'DELETE FROM theses WHERE id = ?';
    const deleteAplies = 'DELETE FROM Applies WHERE id_thesis = ?';
    const deleteFavorites = 'DELETE FROM favorite WHERE id_thesis = ?';
    const deleteAccepted = 'DELETE FROM AcceptedApplication WHERE id_thesis = ?';
    const deleteConfirmed = 'DELETE FROM confirmed WHERE id_thesis = ?';

    // Get a connection from the DB pool for transaction
    db.getConnection((err, connection) => {
        if (err) {
            // Handle error getting connection
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ message: 'Error getting DB connection' });
        }

        // Start a database transaction to ensure all deletes succeed together
        connection.beginTransaction((err) => {
            if (err) {
                // Handle error starting transaction
                console.error("Error starting transaction:", err);
                connection.release();
                return res.status(500).json({ message: 'Error starting transaction' });
            }

            // Delete the thesis from theses table
            connection.query(deleteThesis, [thesisId], (err, result) => {
                if (err) {
                    // On error, rollback transaction and release connection
                    console.error("Error deleting thesis:", err);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: 'Error deleting thesis' });
                    });
                }

                // If no rows affected, thesis ID was not found
                if (result.affectedRows === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ message: 'Thesis not found' });
                    });
                }

                // Array of queries to delete associated records
                const deleteQueries = [deleteAplies, deleteFavorites, deleteAccepted, deleteConfirmed];

                let queryIndex = 0;

                // Recursive function to execute each delete query in order
                function runNextQuery() {
                    if (queryIndex < deleteQueries.length) {
                        connection.query(deleteQueries[queryIndex], [thesisId], (err) => {
                            if (err) {
                                // On error, rollback and release connection
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
                        // If all deletes succeeded, commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                // On commit error, rollback and release
                                console.error("Error committing transaction:", err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: 'Error committing transaction' });
                                });
                            }
                            // Release connection and send success response
                            connection.release();
                            res.status(200).json({ message: 'Thesis and associated records deleted successfully' });
                        });
                    }
                }

                // Start running delete queries for associated records
                runNextQuery();
            });
        });
    });
});

// DELETE endpoint to withdraw (delete) an application by its ID
app.delete('/myaply/:id', (req, res) => {
    const thesisId = parseInt(req.params.id);  // Convert the ID parameter from string to integer

    // SQL query to delete the application from the 'Applies' table based on the given ID
    const sql = 'DELETE FROM Applies WHERE id = ?';

    // Execute the delete query
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            // Log and respond with an error if something goes wrong during deletion
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        // If no rows were affected, it means no matching record was found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        // If successful, return a success message
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });
});


// DELETE endpoint to withdraw (delete) an accepted application by its ID
app.delete('/accept/:id', (req, res) => {
   
    const thesisId = parseInt(req.params.id);  // Convert the ID parameter from string to integer

    // SQL query to delete the application from the 'Applies' table based on the given ID
    const sql = 'DELETE FROM Applies WHERE id = ?';

    // Execute the delete query
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            // Log and respond with an error if something goes wrong during deletion
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        // If no rows were affected, it means no matching record was found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        // If successful, return a success message
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });

});


// PATCH endpoint to update the state of a proposal (accept, reject, confirm)
app.patch('/proposalAcceptConfirm/:id', (req, res) => {
   
    const { id } = req.params;        // Extract proposal ID from URL parameters
   
    const { state } = req.body;       // Extract the new state from the request body

    // Validate the 'state' value: must be 'accepted', 'rejected', or 'confirmed'
    if (!state || (state !== 'accepted' && state !== 'rejected' && state !== 'confirmed')) {
        return res.status(400).json({ error: 'Invalid state value. Only "accepted" or "rejected", confirmed allowed.' });
    }

    // SQL query to update the state of a proposal in the 'Propouses' table
    const sql = `
        UPDATE Propouses 
        SET state = ? 
        WHERE id = ?
    `;

    // Execute the update query
    db.query(sql, [state, id], (err, result) => {
     
        if (err) {
            // Log and respond with error if database update fails
            console.error('Error updating state in the database:', err);
            return res.status(500).json({ error: 'Database error during state update.' });
        }

        // If no rows were affected, proposal with given ID does not exist
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proposal not found.' });
        }

        // Return success message with updated state
        res.status(200).json({ message: `Proposal state updated to "${state}".` });

    });

});




// PATCH endpoint to update the state of a proposal (accept or reject only)
app.patch('/proposaReject/:id', (req, res) => {
   
    const { id } = req.params;        // Extract proposal ID from URL parameters
    const { state } = req.body;       // Extract the new state from the request body

    // Validate the 'state' value: must be either 'accepted' or 'rejected'
    
    if (!state || (state !== 'accepted' && state !== 'rejected')) {
        return res.status(400).json({ error: 'Invalid state value. Only "accepted" or "rejected" allowed.' });
    }

    // SQL query to update the state of a proposal in the 'Propouses' table
    const sql = `
        UPDATE Propouses 
        SET state = ? 
        WHERE id = ?
    `;


    // Execute the update query

    db.query(sql, [state, id], (err, result) => {
     
        if (err) {
            // Log and respond with error if database update fails
            console.error('Error updating state in the database:', err);
            return res.status(500).json({ error: 'Database error during state update.' });
        }

        // If no rows were affected, proposal with given ID does not exist
       
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proposal not found.' });
        }

        // Return success message with updated state
       
        res.status(200).json({ message: `Proposal state updated to "${state}".` });
    });
});

// POST route to add an accepted application into the AcceptedApplication table
app.post('/acceptedApplications', (req, res) => {
  
    const acceptedApplication = req.body;

    // Extract the required fields from the request body
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

    // Check if all required fields are present
    if (!id_thesis || !faculty || !title || !id_prof || !prof_name || !prof_email || !stud_id || !stud_email || !stud_name || !stud_program || !date) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // Prepare SQL query to insert the accepted application
    const sql = `INSERT INTO AcceptedApplication (id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, data, origin, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
   
    const values = [id_thesis, faculty, title, id_prof, prof_name, prof_email, stud_id, stud_email, stud_name, stud_program, date, origin, cover_letter];

    // Execute the insert query
    db.query(sql, values, (error, results) => {
     
        if (error) {
            console.error('Error inserting into AcceptedApplication:', error);
            return res.status(500).json({ error: 'Database insertion error.' });
        }

        // On successful insert, respond with success message and new record ID
        res.status(201).json({ message: 'Application accepted successfully!', id: results.insertId });
   
    });

});



 // DELETE route to remove an application from Applies table by thesis ID
app.delete('/delMyAplication/:id', (req, res) => {
    
    const thesisId = parseInt(req.params.id);

    // Prepare SQL query to delete the application by thesis ID
   
    const sql = 'DELETE FROM Applies WHERE id_thesis = ?';
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        // If no rows were deleted, thesis ID was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        // Confirm successful deletion
        res.status(200).json({ message: 'Thesis withdrawn successfully' });
    });
});


// GET route to retrieve all accepted applications for a student by student ID
app.get('/Responses/:id', async (req, res) => {
    
    const studentId = parseInt(req.params.id); 
   
    const query = "SELECT * FROM AcceptedApplication WHERE stud_id = ?";  
    
    db.query(query, [studentId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        // Send the list of accepted applications as JSON response
        res.json(results); 
    });
});


// GET route to retrieve all accepted applications for a professor by professor ID
app.get('/Accepted/:id', async (req, res) => {
    
    const professorId = parseInt(req.params.id); 
    
    const query = "SELECT * FROM AcceptedApplication WHERE id_prof = ?";  
    
    db.query(query, [professorId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});


// GET route to retrieve all applications from Applies table for a professor by professor ID
app.get('/aplies/:id', async (req, res) => {
    
    const professorId = parseInt(req.params.id); 
    
    const query = "SELECT * FROM Applies WHERE id_prof = ?";  
    
    db.query(query, [professorId], (err, results) => { 
        if (err) {
            console.error("Error fetching applications:", err);
            return res.status(500).json({ error: "Error fetching applications." });
        }
        res.json(results); 
    });
});


// GET route to retrieve all confirmed theses for a student (student ID passed via query parameter)
app.get('/confirmedThesis', (req, res) => {
   
    const id_stud = req.query.id_stud; 
   
    if (!id_stud) {
        return res.status(400).json({ error: "id_stud is required" });
    }

    const sql = 'SELECT * FROM confirmed WHERE id_stud = ?';

    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching confirmed theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });

});


// GET route to retrieve all confirmed theses for a professor (professor ID passed via query parameter)
app.get('/confirmed', (req, res) => {
    
    const id_prof = req.query.id_prof; 
   
    if (!id_prof) {
        return res.status(400).json({ error: "id_prof is required" });
    }

    const sql = 'SELECT * FROM confirmed WHERE id_prof = ?';

    db.query(sql, [id_prof], (error, results) => {
        if (error) {
            console.error("Error fetching confirmed theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// GET route to retrieve all proposals for a professor by professor name, excluding accepted proposals
app.get('/propoused/:name', async (req, res) => { 
   
    const profname = req.params.name; 
    
    const query = "SELECT * FROM Propouses WHERE prof_name = ? and state <> 'accepted'";  

    db.query(query, [profname], (err, results) => { 
        if (err) {
            console.error("Error fetching proposals:", err);
      
            return res.status(500).json({ error: "Error fetching proposals." });
        }
        // Return proposals for the professor that are not accepted yet
       
        res.json(results); 
    });
});


//-----------------------------------------------------------------Confirmation from responsed_card-----------


// Route to confirm a thesis application
app.post('/confirmation', (req, res) => {
   
    // Destructure the needed fields from request body
    const { id_thesis, id_prof, id_stud, date, cover_letter } = req.body;

    // Query to check the available slots (limit) for the given thesis
    const checkLimitQuery = `SELECT limita FROM theses WHERE id = ?`;
    db.query(checkLimitQuery, [id_thesis], (err, result) => {
        if (err) {
            console.error("Error fetching thesis limit:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // If no thesis found with this id, return 404
        if (result.length === 0) {
            return res.status(404).json({ message: "Thesis not found" });
        }

        const thesisLimit = result[0].limita;

        // If there are available slots for this thesis
       
        if (thesisLimit > 0) {
            // Insert a new confirmed application into the confirmed table
            const insertConfirmedQuery = `INSERT INTO confirmed (id_thesis, id_prof, id_stud, date, cover_letter) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertConfirmedQuery, [id_thesis, id_prof, id_stud, date, cover_letter], (err, result) => {
                if (err) {
                    console.error("Error adding confirmed application:", err);
                    return res.status(500).json({ message: "Internal server error" });
                }

                // Decrease the available slots by 1 for the thesis
                const updateLimitQuery = `UPDATE theses SET limita = limita - 1 WHERE id = ?`;
                db.query(updateLimitQuery, [id_thesis], (err, result) => {
                    if (err) {
                        console.error("Error updating thesis limit:", err);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    // If after decrementing the limit reaches 0, close the thesis (state = 'closed')
                    const updateStateQuery = `UPDATE theses SET state = 'closed' WHERE limita = 0 AND id = ?`;
                    db.query(updateStateQuery, [id_thesis], (err, result) => {
                        if (err) {
                            console.error("Error updating thesis state:", err);
                            return res.status(500).json({ message: "Internal server error" });
                        }

                        // Update the student's record to mark thesis_confirmed = 1
                        const updateStudentQuery = `UPDATE studentii SET thesis_confirmed = 1 WHERE id = ?`;
                        db.query(updateStudentQuery, [id_stud], (err, result) => {
                            if (err) {
                                console.error("Error updating student thesis_confirmed:", err);
                                return res.status(500).json({ message: "Internal server error" });
                            }

                            // Respond with success after all operations succeed
                            res.status(201).json({ 
                                message: "Application confirmed successfully and student thesis_confirmed updated" 
                            });
                        });
                    });
                });
            });
        } else {
            // If limit is 0 or less, respond with error indicating limit reached
            res.status(400).json({ message: "Limit has been reached for this thesis" });
        }
    });
});

// Route to get professor details by professor ID
app.get("/getProfessor/:id_prof", (req, res) => {
   
    const { id_prof } = req.params;

    // Validate if professor ID was provided
    if (!id_prof) {
        return res.status(400).json({ error: "id_prof is required" });
    }

    // Query to get professor details from the 'profesorii_neverificati' table
    const sql = 'SELECT * FROM profesorii_neverificati WHERE id = ?';

    db.query(sql, [id_prof], (error, results) => {
        if (error) {
            console.error("Error fetching professor:", error);
            return res.status(500).json({ error: "Database error" });
        }

        // If no professor found, return 404
        if (results.length === 0) {
            return res.status(404).json({ error: "Professor not found" });
        }

        // Return the professor data as JSON
        res.json(results[0]); 
    });
});

// Route to confirm a thesis proposal (confirmationPropouse)
app.post('/confirmationPropouse', (req, res) => {
    // Destructure and validate required fields from request body
   
    const { id_thesis, id_prof, id_stud, date, origin } = req.body;

    if (!id_thesis || !id_prof || !id_stud || !date || !origin) {
        return res.status(400).json({ error: 'All fields are required: id_thesis, id_prof, id_stud, date, origin.' });
    }

    // Insert the confirmation into the confirmed table
    const insertSql = `
        INSERT INTO confirmed (id_thesis, id_prof, id_stud, date, origin)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [id_thesis, id_prof, id_stud, date, origin], (err, result) => {
      
        if (err) {
            console.error('Error inserting into confirmed table:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                // Handle duplicate entry error specifically
                return res.status(400).json({ error: 'Duplicate entry: This record already exists in the confirmed table.' });
            }
            return res.status(500).json({ error: 'Database error during insertion.' });
        }

        // Update the proposal's state to 'confirmed' in the Propouses table
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

            // If no rows were updated, proposal not found
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'Proposal not found in Propouses table.' });
            }

            // Update the student's thesis_confirmed status to 1
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

                // Return success message along with inserted and updated data info
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

// Route to send a message between student and professor related to selection
app.post('/send_message_select', (req, res) => {
    // Extract message details from the request body
   
    const { message, id_stud, id_prof, sender, location } = req.body;

    // Validate that all required fields are present
    if (!message || !id_stud || !id_prof || !sender || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the message into the messages_selection table with the current timestamp
    const query = `
       
        INSERT INTO messages_selection (stud_id, prof_id, message, sender, location, date)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    db.query(query, [id_stud, id_prof, message, sender, location], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).json({ error: 'Error sending message' });
        }

        // Respond with details of the newly created message
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

// Route to delete a thesis response by student ID
app.delete('/response/:id', (req, res) => {
   
    // Parse the student ID from the URL parameter
    const thesisId = parseInt(req.params.id);

    // Delete the accepted application record for the given student ID
    
    const sql = 'DELETE FROM AcceptedApplication WHERE stud_id = ?';
    db.query(sql, [thesisId], (err, result) => {
        if (err) {
            console.error("Error deleting thesis:", err);
            return res.status(500).json({ message: 'Error deleting thesis' });
        }

        // If no rows were affected, the thesis was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thesis not found' });
        }

        // Respond with success message after deletion
       
        res.status(200).json({ message: 'Thesis withdrawn successfully' });

    });
});


//--------------------------------------------------MyPropuse--------------------------------------------------
//--------------------------------------------------MyPropuse--------------------------------------------------

// Route to get professors by faculty
app.get('/get-professors', (req, res) => {
    const faculty = req.query.faculty;

    // Check if faculty query parameter is provided
    if (!faculty) {
        return res.status(400).json({ error: 'Faculty parameter is required' });
    }
   
    // SQL query to select all professors from the specified faculty
    const query = `
        SELECT *
        FROM profesorii_neverificati 
        WHERE faculty = ?;
    `;

    // Execute the query with the faculty parameter
    db.query(query, [faculty], (err, results) => {
        if (err) {

            console.error('Error fetching professors:', err);
            return res.status(500).json({ error: 'Failed to fetch professors' });
        }

        // If no professors found, return 404
        if (results.length === 0) {
         
            return res.status(404).json({ message: 'No professors available for the specified faculty' });
        }

        // Return the list of professors as JSON
        res.json(results);
    });
});


// Route to add a new proposal submitted by a user
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
   
    // SQL query to insert the proposal data into the proposals table
    const query = `
        INSERT INTO proposals 
        (title, description, additional_info, professor_id, argumets, user_faculty, user_study_program, user_id, stud_name, prof_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the insert query with values from request body
    db.query(
     
        query,
        [title, description, additional_info, professor_id, motivation, user_faculty, user_study_program, user_id, user_name, prof_name],
        (err, results) => {
            if (err) {
                console.error('Error inserting proposal:', err);
                res.status(500).json({ message: 'Failed to insert proposal.' });
                return;
            }
            // Respond with success and the new proposal ID
            res.status(201).json({ message: 'Proposal submitted successfully!', proposalId: results.insertId });
        }
    );
});


// Route to get proposals submitted by a specific student user
app.get('/getProposals/:userId', async (req, res) => {
  
    const id_stud = req.params.userId; 
    
    // Validate that userId parameter exists
    if (!id_stud) {
         return res.status(400).json({ error: "id_stud is required" });
    }

    // SQL query to select all proposals by this student
    const sql = 'SELECT * FROM Propouses WHERE stud_id = ?';

    // Execute the query with student ID parameter
   
    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        // Return the proposals as JSON
        res.json(results);
    });
});


// Route to withdraw (delete) a proposal by its ID
app.delete('/withdrawApplication/:id', (req, res) => {
    const { id } = req.params; 
   
    // Validate that id parameter is provided
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    // SQL query to delete the proposal from the Propouses table
    const query = 'DELETE FROM Propouses WHERE id = ?';

    // Execute the delete query with the proposal ID
    db.query(query, [id], (err, result) => {
       
        if (err) {
            console.error('Error deleting proposal:', err);
            return res.status(500).json({ error: 'Failed to withdraw thesis' });
        }

        // If no rows affected, the proposal was not found
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // Respond with success message
       
        res.status(200).json({ message: 'Thesis withdrawn successfully.' });
    });
});


//--------------------------------------------------Add_To_Favorite--------------------------------------------------
//--------------------------------------------------Add_To_Favorite--------------------------------------------------


// Route to add a thesis to user's favorites
app.post('/fav', async (req, res) => {
    const { userId, thesisId } = req.body;
   
    // Check if both userId and thesisId are provided
    if (!userId || !thesisId) {
        return res.status(400).json({ error: 'Missing userId or thesisId' });
    }

    try {
        // Insert a record into the favorite table linking user and thesis
        await db.query('INSERT INTO favorite (id_user, id_thesis) VALUES (?, ?)', [userId, thesisId]);
        res.status(200).json({ message: 'Added to favorites' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to remove a thesis from user's favorites
app.delete('/fav', async (req, res) => {
   
    const { userId, thesisId } = req.body;

    // Check if both userId and thesisId are provided
    if (!userId || !thesisId) {
        return res.status(400).json({ error: 'Missing userId or thesisId' });
    }

    try {
        // Delete the favorite record for this user and thesis
        await db.query('DELETE FROM favorite WHERE id_user = ? AND id_thesis = ?', [userId, thesisId]);
        res.status(200).json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to check if a thesis is in user's favorites
app.get('/check', (req, res) => {
    
    const { userId, thesisId } = req.query;

    const query = `SELECT * FROM favorite WHERE id_user = ? AND id_thesis = ?`;

    // Execute the query to find favorite record for given user and thesis
    db.query(query, [userId, thesisId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        // If found, return true and the data, else false
        if (result.length > 0) {
    
            return res.json({ isFavorite: true, data: result[0] });
        } else {
            return res.json({ isFavorite: false });
        }
    });
});

//-------------------------------------------------------UpBar----------------------------------------------

// Route to get the count of favorites for a user (used for UI display in the top bar)
app.get('/count', (req, res) => {
  
    const { userId } = req.query; 

    // Check if userId parameter is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // SQL query to count the number of favorite theses for the user
    const query = `
        SELECT COUNT(*) AS count FROM favorite WHERE id_user = ?;
    `;

    // Execute the query with userId parameter
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching favorites:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Send back the count of favorites as JSON
        const favoriteCount = results[0].count;
        return res.json({ count: favoriteCount });
    });
});


//-==------------------------------------------------MyConfiremd_thesis----------------------------------------
//-==------------------------------------------------MyConfiremd_thesis----------------------------------------


// Endpoint to get thesis title based on thesis ID and origin ('propouse' or others)

app.get('/ConfirmInformation/:id_thesis', async (req, res) => {
   
    const id_thesis = req.params.id_thesis;  // Extract thesis ID from URL params
    const origin = req.query.origin;          // Get origin from query string

    // Validate if thesis ID is provided
    if (!id_thesis) {
         return res.status(400).json({ error: "id_thesis is required" });
    }   

    // If origin is NOT 'propouse', query the 'theses' table
    if(origin !== 'propouse'){
        
        const sql = 'SELECT title FROM theses WHERE id = ?';

        db.query(sql, [id_thesis], (error, results) => {
            if (error) {
                console.error("Error fetching applied theses:", error);
                return res.status(500).json({ error: "Database error" });
            }
            // Return the thesis title(s)
            res.json(results);
        });

    // If origin is 'propouse', query the 'Propouses' table
    } else if(origin === 'propouse') {
       
        const sql= 'SELECT title FROM Propouses WHERE id = ?';

        db.query(sql, [id_thesis], (error, results) => {
            if (error) {
                console.error("Error fetching applied theses:", error);
                return res.status(500).json({ error: "Database error" });
            }
            // Return the proposed thesis title(s)
            res.json(results);
        });
    }
});


// Endpoint to get student information by student ID
app.get('/ConfirmInformation_Student/:id_stud', async (req, res) => {
    
    const id_stud = req.params.id_stud;  // Extract student ID from URL params

    // Validate if student ID is provided
    if (!id_stud) {
         return res.status(400).json({ error: "id_stud is required" });
    }   

    // Query the 'studentii' table for the student data
    const sql = 'SELECT * FROM studentii WHERE id = ?';

    db.query(sql, [id_stud], (error, results) => {
        if (error) {
            console.error("Error fetching applied theses:", error);
            return res.status(500).json({ error: "Database error" });
        }
        // Return student data
        res.json(results);
    });
});



//---------------------------------Favorite-related endpoints-------------------------------------

// Get all favorite thesis IDs for a given user
app.get("/Favorites/:id_user", (req, res) => {
   
    const { id_user } = req.params;  // Extract user ID from URL params
    const query = "SELECT id_thesis FROM favorite WHERE id_user = ?";

    // Query the 'favorite' table for all thesis IDs favorited by the user
    db.query(query, [id_user], (err, results) => {
        if (err) {
            console.error("Error fetching favorites:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        // Return list of favorite thesis IDs
        res.json(results);
    });
});

// Get detailed information for a thesis by its ID
app.get("/ThesisDetails/:id_thesis", (req, res) => {
    
    const { id_thesis } = req.params;  // Extract thesis ID from URL params
    const query = `SELECT * FROM theses WHERE id = ?`;

    // Query the 'theses' table for all details of the specified thesis
    db.query(query, [id_thesis], (err, results) => {
        if (err) {
            console.error("Error fetching thesis details:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        // If no thesis found, return 404 error
        if (results.length === 0) {
            return res.status(404).json({ error: "Thesis not found." });
        }
        // Return thesis details (first match)
        res.json(results[0]);
    });
});



//------------------------ Password Restore related endpoints-----------------------------------------------

// Check if an email exists in either professors or students tables, and whether password reset is allowed
app.get('/check-email/:email', async (req, res) => {
  
    const email = req.params.email;

    const queryProf  = 'SELECT * FROM profesorii_neverificati WHERE email = ?';
    const queryStud = 'SELECT * FROM studentii WHERE email = ?';

    // First check if email exists in professors table
    
    db.query(queryProf, [email], (err, profResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (profResults.length > 0) {
            const prof = profResults[0];

            // If professor uses Gmail login, password change is not allowed
            if (prof.gmail_password && prof.gmail_password.trim().length > 0) {
                return res.status(403).json({
                    message: 'Cannot change password. User is logged in with Gmail.',
                });
            }
            // Email found in professor table
            return res.status(200).json({
                message: 'Is found as prof',
                table: 'profesorii_neverificati',
            });
        } else {
            // If not found among professors, check students table
            db.query(queryStud, [email], (err, studResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database error' });
                }

                if (studResults.length > 0) {
                    const stud = studResults[0];

                    // If student uses Gmail login, password change is not allowed
                    if (stud.gmail_pass && stud.gmail_password.trim().length > 0) {
                        return res.status(403).json({
                            message: 'Cannot change password. User is logged in with Gmail.',
                        });
                    }
                    // Email found in student table
                    return res.status(200).json({
                        message: 'Is found as stud',
                        table: 'studentii',
                    });
                } else {
                    // Email not found in either table
                    return res.status(404).json({ message: 'Email not found' });
                }
            });
        }
    });
});


// Endpoint to update a user's password in the specified table
app.patch('/update-password', async (req, res) => {
   
    const { email,password, table } = req.body;


    // Validate required fields
    if (!email || !password || !table) {
        return res.status(400).json({ success: false, message: 'Missing email, password, or table' });
    }

    try {
        // Hash the new password with salt rounds from environment variable
        const saltRounds = parseInt(process.env.SALT); 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Determine which table to update based on the 'table' value
        const updateQuery =
            table === 'studentii'
                ? 'UPDATE studentii SET pass = ? WHERE email = ?'
                : 'UPDATE profesorii_neverificati SET password = ? WHERE email = ?';

        // Execute the update query with hashed password and email
        db.query(updateQuery, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error("Database error: ", err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            // Check if any rows were affected (i.e., user was found and updated)
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



//---------------------- Thesis control endpoints: stop/open/modify thesis ----------------------------

// Endpoint to pause (stop) a thesis by setting its state to 'pause'
app.patch("/stop_thesis/:id", async (req, res) => {

    const { id } = req.params;

    try {
        const result = await db.query(
            "UPDATE theses SET state = 'pause' WHERE id = ?",
            [id]
        );

        // If no thesis found with given ID
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Thesis not found" });
        }

        res.status(200).json({ message: "Thesis state updated to stopped" });
    } catch (error) {
        console.error("Error updating thesis state:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Endpoint to reopen a thesis by setting its state to 'open'
app.patch("/open_thesis/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            "UPDATE theses SET state = 'open' WHERE id = ?",
            [id]
        );

        // If no thesis found with given ID
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Thesis not found" });
        }

        res.status(200).json({ message: "Thesis state updated to open" });
    } catch (error) {
        console.error("Error updating thesis state:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Endpoint to get  full thesis detais by thesis ID
app.get('/thesis/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;

    const sql = 'SELECT * FROM theses WHERE id = ?';

    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error getting thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        // Return all details for the thesis
        res.json(results);
    });
});


// Endpoint to  update thesis data (title, description, requirements, limits, dates, and state)
app.patch("/update_thesis/:id", (req, res) => {
  
    const { id } = req.params;
   
    const thesisData = req.body;

    const { title, description, requirements, limita, start_date, end_date } = thesisData;

    // Use provided start/end dates or default to current date if missing
    const startDate = start_date || new Date();
    const endDate = end_date || new Date();

    // Set thesis state based on 'limita' value (0 = closed, otherwise open)
    const state = limita == 0 ? "closed" : "open";

    // SQL update statement

    const query = `
      UPDATE theses
      SET title = ?, description = ?, requirements = ?, limita = ?, start_date = ?, end_date = ?, state = ?
      WHERE id = ?
    `;

    db.query(
        query,
        [title, description, requirements, limita, startDate, endDate, state, id],
        (error, results) => {
            if (error) {
                console.error("Error updating thesis:", error);
                return res.status(500).json({ error: "Database error" });
            }

            res.status(200).json({ message: "Thesis updated successfully" });
        }
    );
});








//-----------------------------------------MyPropouse_Info----------------------------------------------------------------------------------

// Get proposal details by thesis ID
app.get('/MyPropouse/:thesis_id', async (req, res) => {
   
    const thesisId = req.params.thesis_id;

    const sql = 'SELECT * FROM Propouses WHERE id = ?';

    // Query database for proposal with the given thesis ID

    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error getting thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        // Return the results as JSON
        res.json(results);
    });
});

// Get confirmed thesis info by thesis ID

app.get('/MyConfirm_Info/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;

    const sql = 'SELECT * FROM theses WHERE id = ?';

    // Query database for thesis with the given ID
    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error getting thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        // Return the results as JSON
        res.json(results);
    });
});

// Get student information by student ID
app.get('/student_info/:id', async (req, res) => {
    const stud_id = req.params.id;

    const sql = 'SELECT * FROM studentii WHERE id = ?';

    // Query database for student with the given ID
    db.query(sql, [stud_id], (error, results) => {
        if (error) {
            console.error("Error fetching student data:", error);
            return res.status(500).json({ error: "Database error" });
        }

        // If student found, return first result, else send 404
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    });
});

// ---------------------------------------------------------------
// Get application info by thesis ID
app.get('/Applied_info/:thesis_id', async (req, res) => {
    const thesisId = req.params.thesis_id;

    const sql = 'SELECT * FROM Applies WHERE id = ?';

    // Query database for application with the given thesis ID
    db.query(sql, [thesisId], (error, results) => {
        if (error) {
            console.error("Error getting thesis:", error);
            return res.status(500).json({ error: "Database error" });
        }
        // Return the results as JSON
        res.json(results);
    });
});

// Get all applications for a specific student ID
app.get('/show_My_applies/:studentId', (req, res) => {
    const profId = parseInt(req.params.studentId);

    // Check if the student ID is a valid number
    if (isNaN(profId)) {
        return res.status(400).json({ message: "Invalid professor ID" });
    }

    const sql = 'SELECT * FROM Applies WHERE id_stud = ?';

    // Query database for all applications by this student
    db.query(sql, [profId], (err, results) => {
        if (err) {
            console.error("Error fetching theses:", err);
            return res.status(500).json({ message: 'Error fetching theses' });
        }
        // Send list of applications as response
        res.status(200).json(results);
    });
});

// -------------------------------------
// Get confirmed info for student's thesis page by user ID

app.get("/get_info_my_th_page/:id", (req, res) => {
   
    const userId = req.params.id;

    // Query confirmed table for entries matching student ID
    db.query("SELECT * FROM confirmed WHERE id_stud = ?", [userId], (err, results) => {
      
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        // Return the first matching record
        res.json(results[0]);
    });
});

// Get thesis by thesis ID and professor ID
app.get("/these_s/:id_thesis/:id_prof", (req, res) => {
    const { id_thesis, id_prof } = req.params;

    // Query theses table with thesis ID and professor  ID

    db.query("SELECT * FROM theses WHERE id = ? AND prof_id = ?", [id_thesis, id_prof], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        // Return matching theses
        res.json(results);
    });
});

// Get proposal by student ID and thesis ID
app.get("/propus_e/:id_stud/:id_thesis", (req, res) => {
   
    const { id_stud, id_thesis } = req.params;

    // Query proposals matching both student ID and thesis ID
    db.query("SELECT * FROM Propouses WHERE stud_id = ? AND id = ?", [id_stud, id_thesis], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
      
        res.json(results);
    });
});

// Get unverified professor by professor ID
app.get("/profesori_neverificat_i/:id_prof", (req, res) => {
    const { id_prof } = req.params;

    // Query unverified professors table for given ID

    db.query("SELECT * FROM profesorii_neverificati WHERE id = ?", [id_prof], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// Insert a new message into the messages table
app.post('/send_message', (req, res) => {

    const { message, id_stud, id_prof, sender } = req.body;

    // Validate required fields
    if (!message || !id_stud || !id_prof) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
      INSERT INTO messages (mesaje, id_stud, id_prof, created_at, sender)
      VALUES (?, ?, ?, NOW(), ?)
    `;



    // Insert the message into database
    db.query(query, [message, id_stud, id_prof, sender], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).json({ error: 'Error saving message' });
        }

        // Confirm success
        res.status(200).json({ message: 'Message sent successfully' });
    });
});

// Retrieve all messages between a professor and a student
app.get('/read_messages/:prof_id/:student_id', (req, res) => {
   
    const { prof_id, student_id } = req.params;

    const query = `SELECT * FROM messages WHERE id_stud = ? AND id_prof = ? ORDER BY created_at`;

    // Query messages ordered by creation date
    db.query(query, [student_id, prof_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving messages' });
        }
        // Return messages
        res.json(results);
    });
});

// Route to get messages between a professor and a student, ordered by date
app.get('/read_messages_selection/:prof_id/:student_id', (req, res) => {
   
    const { prof_id, student_id } = req.params;
  
    // SQL quey to select messages between the specified student and professor
   
    const query = `SELECT * FROM messages_selection WHERE stud_id = ? AND prof_id = ? ORDER BY date`;
  
    // Execute the query with prof_id and student_id as parameters

    db.query(query, [prof_id, student_id], (err, results) => {
      if (err) {
        // Return error if query fails
        return res.status(500).json({ message: 'Error retrieving messages' });
      }
      // Return the retrieved messages as JSON
      res.json(results);
    });
  });
  
  // Route to get information about a specific student by their ID
  app.get('/student_info/:student_id', (req, res) => {
    
    const { student_id } = req.params;
  
    // SQL query  to select the student with the given ID
    const query = `SELECT * FROM studentii WHERE id = ?`;
  
    // Execute the query with student_id as parameter
    db.query(query, [student_id], (err, results) => {
      if (err) {
    
        // Return error if query fails
        return res.status(500).json({ message: 'Error retrieving student info' });
      }
      // Return the student info as JSON
      res.json(results);
    });
  });
  
  // ------------------------------------- Professor Chat ---------------------------------------------
  
  // Route to get a thesis or a proposal by its ID
  app.get('/get_thesis/:thesis_id', (req, res) => {
   
    const { thesis_id } = req.params;
  
    const queryTheses = "SELECT * FROM theses WHERE id = ?";
    const queryPropouses = "SELECT * FROM Propouses WHERE id = ?";
  
    // First, try to find the thesis in the 'theses' table
    db.query(queryTheses, [thesis_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error querying theses" });
      }
  
      if (results.length > 0) {
        // If thesis found, return it
        return res.json(results);
      }
  
      // If not found in 'theses', try in 'Propouses' table
      db.query(queryPropouses, [thesis_id], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error querying Propouses" });
        }
  
        if (results.length > 0) {
          // Return the proposal if found
          return res.json(results);
        } else {
          // Return  if not found in any table
          return res.status(404).json({ message: "Thesis not found in any table" });
        }
      });

    });
  });
  
  // ================================= Admin Page ======================================
  
  // Route to get all theses filtered by faculty

  app.get("/getAllTheses", (req, res) => {
    const { faculty } = req.query;
  
    // Check if faculty parameter is provided
    if (!faculty) {
      return res.status(400).json({ error: "You must select a faculty!" });
    }
  
    // SQL query to select all theses for the given faculty
    const sql = "SELECT * FROM theses WHERE faculty = ?";
  
    // Execute query with faculty parameter
    db.query(sql, [faculty], (err, result) => {
      if (err) {
        console.error("Error querying theses:", err);
        return res.status(500).json({ error: "Error fetching theses" });
      }
      // Return the theses as JSON
      res.json(result);
    });
  });
  


  // Route to get all students filtered by faculty
  
  app.get("/getStudents", (req, res) => {
    const { faculty } = req.query;
  
    if (!faculty) {
      return res.status(400).json({ error: "You must select a faculty!" });
    }
  
    // SQL query  to select all students for the given faculty
   
    const sql = "SELECT * FROM studentii WHERE faculty = ?";
  
    db.query(sql, [faculty], (err, result) => {
      if (err) {
        console.error("Error querying students:", err);
        return res.status(500).json({ error: "Error fetching students" });
      }
      res.json(result);
    });
  });
  
  // Route to get all unverified professors filtered by faculty
  app.get("/getAllProfessors", (req, res) => {
    const { faculty } = req.query;
  
    if (!faculty) {
      return res.status(400).json({ error: "You must select a faculty!" });
    }
  
     // SQL query to select  unverified professors for the given faculty
    const sql = "SELECT * FROM profesorii_neverificati WHERE faculty = ?";
  
    db.query(sql, [faculty], (err, result) => {
      if (err) {
        console.error("Error querying professors:", err);
        return res.status(500).json({ error: "Error fetching professors" });
      }
      res.json(result);
    });
  });
  

  // Route to get all confirmed records (no filtering)
  app.get("/getAllConfirmed", (req, res) => {
    const sql = "SELECT * FROM confirmed";
  
    db.query(sql, [], (err, result) => {
      if (err) {
        console.error("Error querying confirmed:", err);
        return res.status(500).json({ error: "Error fetching confirmed records" });
      }
      res.json(result);
    });
  });
  
  // Route to get details of a thesis by ID (admin)
  app.get("/thesis_admin", (req, res) => {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ error: "Thesis ID is missing." });
    }
  
    const query = "SELECT * FROM theses WHERE id = ?";
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching thesis:", err);
        return res.status(500).json({ error: "Error fetching thesis." });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Thesis not found." });
      }
  
      // Return the first (and only) thesis record found
      res.json(results[0]);
    });
  });
  
  // Route to delete a thesis and all related records in other tables (admin)
  app.delete("/thesis_admin", (req, res) => {
   
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: "Thesis ID is missing." });
    }
  
    // SQL queries to delete the thesis and related records from associated tables
    const deleteThesis = "DELETE FROM theses WHERE id = ?";
    const deleteAplies = "DELETE FROM Applies WHERE id_thesis = ?";
    const deleteFavorites = "DELETE FROM favorite WHERE id_thesis = ?";
    const deleteAccepted = "DELETE FROM AcceptedApplication WHERE id_thesis = ?";
    const deleteConfirmed = "DELETE FROM confirmed WHERE id_thesis = ?";
  
    // Get a database connection from the pool
    db.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting DB connection:", err);
        return res.status(500).json({ message: "Error getting DB connection." });
      }
  
      // Start a transaction to ensure all deletions happen atomically
      connection.beginTransaction((err) => {
       
        if (err) {
          console.error("Error starting transaction:", err);
          connection.release();
          return res.status(500).json({ message: "Error starting transaction." });
        }
  
        // Delete the thesis first
        connection.query(deleteThesis, [id], (err, result) => {
          if (err) {
            console.error("Error deleting thesis:", err);
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ message: "Error deleting thesis." });
            });
          }
  
          if (result.affectedRows === 0) {
            // If no thesis found to delete, rollback transaction
            return connection.rollback(() => {
              connection.release();
              res.status(404).json({ message: "Thesis not found." });
            });
          }
  
          // Array of delete queries for related tables
          const deleteQueries = [deleteAplies, deleteFavorites, deleteAccepted, deleteConfirmed];
          let queryIndex = 0;
  
          // Function to run the related delete queries sequentially
         
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
              // Commit the transaction after all deletions succeed
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
  
// Route to delete a student and all their related records by admin
app.delete("/delete_student_admin", (req, res) => {
   
    const { id } = req.body;

    // Check if student ID is provided
    if (!id) {
        return res.status(400).json({ error: "Student ID is missing." });
    }

    // SQL queries to delete student and associated records in other tables
    const deleteStudent = "DELETE FROM studentii WHERE id = ?";
    const deleteApplies = "DELETE FROM Applies WHERE id_stud = ?";
    const deleteFavorites = "DELETE FROM favorite WHERE id_user = ?";
    const deleteAccepted = "DELETE FROM AcceptedApplication WHERE stud_id = ?";
    const deleteConfirmed = "DELETE FROM confirmed WHERE id_stud = ?";
    const deleteMessages = "DELETE FROM messages WHERE id_stud = ?";

    // Get a connection from the DB pool
    db.getConnection((err, connection) => {
       
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ error: "Error getting DB connection." });
        }

        // Start a database transaction to ensure all deletions succeed or fail together
        connection.beginTransaction((err) => {
         
            if (err) {
                console.error("Error starting transaction:", err);
                connection.release();
                return res.status(500).json({ error: "Error starting transaction." });
            }

            // Delete the student first
            connection.query(deleteStudent, [id], (err, results) => {
                if (err) {
                    console.error("Error deleting student:", err);
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: "Error deleting student." });
                    });
                }

                // If no rows affected, student not found
                if (results.affectedRows === 0) {
              
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ error: "Student not found." });
                    });
                }

                // Array of other deletion queries to run sequentially
                const deleteQueries = [deleteApplies, deleteFavorites, deleteAccepted, deleteConfirmed, deleteMessages];

                let queryIndex = 0;

                // Recursive function to run each deletion query one by one
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
                        // Commit transaction after all deletions succeed
                      
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

                // Start running the deletion queries
                
                runNextQuery();
            });
        });
    });

});


// Route to toggle verification status of a professor
app.put("/Verify_Profesor", (req, res) => {
    
    const { id, entered } = req.body;

     // Check if professor ID is provided
    if (!id) {
        return res.status(400).json({ error: "Professor ID is missing." });
    }


    // Validate entered value is either 0 or 1
    if (entered !== 0 && entered !== 1) {
        return res.status(400).json({ error: "Invalid value for entered." });
    }

    // Prepare the update query depending on current entered value
    const query = entered === 0
        ? "UPDATE profesorii_neverificati SET entered = 1 WHERE id = ?"
        : "UPDATE profesorii_neverificati SET entered = 0 WHERE id = ?";

    // Execute update query
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error updating professor:", err);
            return res.status(500).json({ error: "Error updating professor." });
        }

        // If no professor found with given ID
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Professor not found." });
        }

        res.json({ message: "Professor verification status updated successfully." });
    });
});



// Route to delete an unverified professor and all related records by admin
app.delete("/delet_profesor_admin", (req, res) => {
    const { id } = req.body;

    // Check if professor ID is provided
    if (!id) {
        return res.status(400).json({ error: "Professor ID is missing." });
    }

   
    // SQL queries to delete professor and associated records
    const deleteStudent = "DELETE FROM profesorii_neverificati WHERE id = ?";
    const deleteApplies = "DELETE FROM Applies WHERE id_prof = ?";
    const deleteFavorites = "DELETE FROM favorite WHERE id_user = ?";
    const deleteAccepted = "DELETE FROM AcceptedApplication WHERE id_prof = ?";
    const deleteConfirmed = "DELETE FROM confirmed WHERE id_prof = ?";
    const deleteMessages = "DELETE FROM messages WHERE id_prof = ?";

    // Get DB connection from pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection:", err);
            return res.status(500).json({ error: "Error getting database connection." });
        }

        // Start transaction for deleting professor and related data
        connection.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                return connection.release(() => res.status(500).json({ error: "Error starting transaction." }));
            }

            // Delete the professor record first
            connection.query(deleteStudent, [id], (err, results) => {
                if (err) {
                    console.error("Error deleting from profesorii_neverificati:", err);
                    return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from profesorii_neverificati." })));
                }

                // If no professor found
                if (results.affectedRows === 0) {
                    return connection.rollback(() => connection.release(() => res.status(404).json({ error: "Professor not found." })));
                }

                // Delete from Applies table
                connection.query(deleteApplies, [id], (err) => {
                    if (err) {
                        console.error("Error deleting from Applies:", err);
                        return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from Applies." })));
                    }

                    // Delete from favorite table
                    connection.query(deleteFavorites, [id], (err) => {
                        if (err) {
                            console.error("Error deleting from favorite:", err);
                            return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from favorite." })));
                        }

                        // Delete from AcceptedApplication table
                        connection.query(deleteAccepted, [id], (err) => {
                            if (err) {
                                console.error("Error deleting from AcceptedApplication:", err);
                                return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from AcceptedApplication." })));
                            }

                            // Delete from confirmed table
                            connection.query(deleteConfirmed, [id], (err) => {
                                if (err) {
                                    console.error("Error deleting from confirmed:", err);
                                    return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from confirmed." })));
                                }

                                // Delete from messages table
                                connection.query(deleteMessages, [id], (err) => {
                                    if (err) {
                                        console.error("Error deleting from messages:", err);
                                        return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error deleting from messages." })));
                                    }


                                    // Commit the transaction after all deletions succeed
                                    connection.commit((err) => {
                                        if (err) {
                                            console.error("Error committing transaction:", err);
                                            return connection.rollback(() => connection.release(() => res.status(500).json({ error: "Error committing transaction." })));
                                        }

                                        connection.release();
                                        res.json({ message: "Professor and related records successfully deleted." });
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


// Route to delete a confirmation by admin and update the student's thesis_confirmed status
app.delete('/delete_confirmation_admin', (req, res) => {
    const { id, id_stud } = req.body; 
    
    // SQL query to delete the confirmation by its ID
    const deleteConfirmedSql = 'DELETE FROM confirmed WHERE id = ?';
    db.query(deleteConfirmedSql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting confirmation:", err);
            return res.status(500).json({ message: 'Error deleting confirmation' });
        }

        // If no confirmation found with given ID
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Confirmation not found' });
        }

        // Update student's thesis_confirmed field to 0 after confirmation deletion
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
