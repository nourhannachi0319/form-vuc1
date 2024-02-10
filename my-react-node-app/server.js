const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vuc',
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err);
        process.exit(1);
    } else {
        console.log('Connexion à la base de données réussie!');
    }
});

app.get('/', (req, res) => {
  return res.json({ message: "From Backend Side" });
  
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/api/submit-form1', (req, res) => {
    const formData = req.body;

    const sql = 'INSERT INTO vuc_pp (typ_per, cin, date_délivr, date_validi_pass, date_validi_résid, nom, prénom, date_naissance, lieu_naissance, nationalité, tuteur) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    
    const values = [
        formData.typ_per,
        formData.cin,
        formData.date_délivr,
        formData.date_validi_pass,
        formData.date_validi_résid,
        formData.nom,
        formData.prénom,
        formData.date_naissance,
        formData.lieu_naissance,
        formData.nationalité,
        formData.tuteur
    ];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Form submitted successfully' });
        }
    });
});

app.get('/api/table', (req, res) => {
    const sql = 'SELECT * FROM vuc_pp';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

app.put('/api/Edit/:id', (req, res) => {
    const id = req.params.id;
    const formData = req.body;

    const values = [
        formData.typ_per,
        formData.cin,
        formData.date_délivr,
        formData.date_validi_pass,
        formData.date_validi_résid,
        formData.nom,
        formData.prénom,
        formData.date_naissance,
        formData.lieu_naissance,
        formData.nationalité,
        formData.tuteur,
        id
    ];

    const sql = 'UPDATE vuc_pp SET typ_per=?, cin=?, date_délivr=?, date_validi_pass=?, date_validi_résid=?, nom=?, prénom=?, date_naissance=?, lieu_naissance=?, nationalité=?, tuteur=? WHERE id=?';

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Form submitted successfully' });
        }
    });
});


process.on('SIGINT', () => {
    connection.end((err) => {
        console.log('Connexion à la base de données fermée.');
        process.exit(err ? 1 : 0);
    });
});
