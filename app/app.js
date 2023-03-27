const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 3000;

const pool = new Pool({
    // user: process.env.POSTGRES_USER,
    // password: process.env.POSTGRES_PASSWORD,
    user: 'postgres',
    password: 'root',
    host: 'db',
    // database: 'postgres',
    // port: 5432
})

const insertQuery = 'INSERT INTO notes(title, body, last_edited) VALUES ($1, $2, $3)';

app.use(express.json())
app.use(express.static('public'))

// app.get('/', async(req, res)=> {
//     try {
//         await pool.query('CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY,title VARCHAR(255) NOT NULL,body TEXT,last_edited TIMESTAMP DEFAULT NOW());').then(res.send("Table created")).catch((err) => console.error('Error creating table: ', err.stack));
//     }
//     catch (e) {
//         res.send(e);
//     }
// })

app.get('/getNotes', (req, res) => {
    pool.query('CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY,title VARCHAR(255) NOT NULL,body TEXT,last_edited TIMESTAMP DEFAULT NOW());').then(console.log('Table created successfully')).catch((err) => console.error('Error creating table: ', err.stack));
    pool.query('SELECT * FROM notes', (err, result) => {
        if (err) {
            console.log('Error retrieving notes', err);
        } else {
            res.json(result.rows);
        }
    })
})

app.post('/addNote', (req, res) => {
    const {title, body} = req.body;
    pool.query(insertQuery, [title, body, new Date]).then(() => console.log('Note saved successfully')).catch((err) => console.error('Error inserting note: ', err.stack));
    res.send('Note saved');
    pool.query('SELECT * FROM notes').then((notes) => console.log(notes.rows)).catch((err) => console.error('Error retrieving notes', err.stack));
})

app.post('/updateNote', (req, res) => {
    const { title, body, id } = req.body;
    pool.query('UPDATE notes SET title=$1, body=$2, last_edited=$3 WHERE id=$4', [title, body, new Date, id]).then(() => console.log('Note updated successfully')).catch((err) => console.error('Error updating note: ', err.stack));
    res.send('Note updated');
})

app.delete('/deleteNote', (req, res) => {
    const { id } = req.body;
    pool.query('DELETE FROM notes WHERE id = $1', [id]).then(() => console.log('Note updated successfully')).catch((err) => console.error('Error updating note: ', err.stack));
    res.send('Note deleted');
})

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('Server listening on port 3000')
});