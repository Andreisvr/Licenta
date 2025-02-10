const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5002; 

app.use(cors());
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: 'andrei.sviridov00@e-uvt.ro', 
        pass: 'nqkx snel lqha hwgr',
    },
});
 


app.post('/reg_stud', (req, res) => {

    
    const { email, code } = req.body;

    const mailOptions = {
        from: 'andrei.sviridov00@e-uvt.ro', 
        to: email,
        subject: 'Cod de verificare',
        text: `Codul tău de verificare este: ${code}`,
    };
   
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); 
            return res.status(500).json({ message: 'Eroare la trimiterea emailului', error });
        }
        console.log('Email sent'); 
        res.status(200).json({ message: 'Codul a fost trimis cu succes', info });
    });
});



app.post('/reg', (req, res) => {

    console.log('Request received:');
    
    const { email, code } = req.body;

    const mailOptions = {
        from: 'andrei.sviridov00@e-uvt.ro', 
        to: email,
        subject: 'Cod de verificare',
        text: `Codul tău de verificare este: ${code}`,
    };
   

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); 
            return res.status(500).json({ message: 'Eroare la trimiterea emailului', error });
        }
        console.log('Email sent:', info); 
        res.status(200).json({ message: 'Codul a fost trimis cu succes', info });
    });
});

app.post('/sendEmail', (req, res) => {
    const { email, subject, text } = req.body;
     console.log('accepted primit');
    const mailOptions = {
        from: 'andrei.sviridov00@e-uvt.ro',
        to: email,
        subject: subject,
        text: text,
    };
        console.log('dddd',mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Eroare la trimiterea emailului', error });
        }
        console.log('Email sent:', info);
        res.status(200).json({ message: 'Email trimis cu succes', info });
        console.log('accepted');
    });
});



app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});






