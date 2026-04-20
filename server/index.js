const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database('NoteApp.db'); // This creates the file automatically

app.use(cors()); // Allows server on localhost:5173 to communicate with other ports (e.g. sqlite server)
app.use(express.json());
app.use(express.static(path.join(__dirname, '../NotesApp/dist')));

// Initialize table
db.exec("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, isDone INTEGER)");
db.exec("CREATE TABLE IF NOT EXISTS Lnotes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)");

// GET all notes
app.get('/notes', (req, res) => {   
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

// GET all Lnotes
app.get('/Lnotes', (req, res) => {   
  const Lnotes = db.prepare('SELECT * FROM Lnotes').all();
  res.json(Lnotes);
});

// POST a new note
app.post('/notes', (req, res) => {
  const { text } = req.body;
  const info = db.prepare('INSERT INTO notes (text, isDone) VALUES (?, ?)').run(text, 0); // ? are the placeholder characters, substituted by the items on the right.
  res.json({ id: info.lastInsertRowid, text, isDone: 0 }); // Returns to the user.
});

app.post('/Lnotes', (req, res) => {
    const { title, content } = req.body;
    const info = db.prepare('INSERT INTO Lnotes (title, content) VALUES (?, ?)').run(title, content);
    res.json({ id: info.lastInsertRowid, title , content });
});


app.delete('/notes/completed', (req, res) => { // Static routes must be placed above dynamic routes to prevent errors.
    try {
        const info = db.prepare('DELETE FROM notes WHERE isDone = ?').run(1);

        res.json({ success: true });
        
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// How does the POST section work, and does this two mean when the app calls for get at /notes it returns all notes and post at /notes means it updates the DB?

// DELETE a note
app.delete('/notes/:id', (req, res) => { // :id is a placeholder, depends on what the react frontend sends.
    const { id } = req.params; // Grabs the ID from the URL
    const info = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    
    if (info.changes > 0) {
        res.json({ message: "Deleted successfully" });
    } else { res.status(404).json({ error: "Note not found" }); }
    
});

app.delete('/Lnotes/:id', (req, res) => {
    
    const {id} = req.params;
    const info = db.prepare('DELETE FROM Lnotes WHERE id = ?').run(id);
    
    if (info.changes > 0) {
        res.json({message: "Deleted Successfully"});
    } else { res.status(404).json({ error: "Note not found." }); }
    
});

// UPDATE the isDone status of a note
app.patch('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { isDone } = req.body; // Expecting { isDone: 1 } or { isDone: 0 }

    try {
        const info = db.prepare('UPDATE notes SET isDone = ? WHERE id = ?').run(isDone, id);
        
        if (info.changes > 0) {
            res.json({ success: true, id, isDone });
        } else {
            res.status(404).json({ error: "Note not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../NotesApp/dist', 'index.html'));
});

// app.listen(5000, () => console.log('Server running on port 5000'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});