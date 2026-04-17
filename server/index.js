const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database('NoteApp.db'); // This creates the file automatically

app.use(cors()); // Allows server on localhost:5173 to communicate with other ports (e.g. sqlite server)
app.use(express.json());

// Initialize table
db.exec("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, isDone INTEGER)");

// GET all notes
app.get('/notes', (req, res) => {   
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

// POST a new note
app.post('/notes', (req, res) => {
  const { text } = req.body;
  const info = db.prepare('INSERT INTO notes (text, isDone) VALUES (?, ?)').run(text, 0); // ? are the placeholder characters, substituted by the items on the right.
  res.json({ id: info.lastInsertRowid, text, isDone: 0 }); // Returns to the user.
});

app.listen(5000, () => console.log('Server running on port 5000'));

// How does the POST section work, and does this two mean when the app calls for get at /notes it returns all notes and post at /notes means it updates the DB?

// DELETE a note
app.delete('/notes/:id', (req, res) => { // :id is a placeholder, depends on what the react frontend sends.
  const { id } = req.params; // Grabs the ID from the URL
  const info = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  
  if (info.changes > 0) {
    res.json({ message: "Deleted successfully" });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});