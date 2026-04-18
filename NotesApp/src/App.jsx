import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Note from './components/Note';
import AddLNote from './components/AddLNote';
import AddNote from './components/AddNote';
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  // 1. "The State" - Think of this as your temporary SQL result set
  // const [notes, setNotes] = useState([
  //   { id: 1, text: "Buy milk", isDone: true},
  //   { id: 2, text: "Learn React", isDone: false}
  // ]);

  const [notes, setNotes] = useState([]);

  // Load notes from the server when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/notes')
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const [Lnotes, setLnotes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/Lnotes')
      .then(res => res.json())
      .then(data => setLnotes(data));
  }, []);

  // What is useEffect? Is it something specific to React or Javascript?
  // How does res and res.json() then become data that can be used with setNotes()?

  // Connecting to SQLite3 DB through Express.js backend.
  const addNote = async (inputText) => {
    const response = await fetch('http://localhost:5000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText })
    });
    
    const newNote = await response.json();
    setNotes([...notes, newNote]); // Update UI with the note the server just created
  };

  // const [lnotes, setLnotes] = useState([
  //   { id: 1, title: "My first note", content: "Hey there this is a test!"},
  //   { id: 2, title: "Second note", content: "This is the second note."}
  // ]);

  const addLnote = async (newNote) => {

    const response = await fetch('http://localhost:5000/Lnotes', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newNote.title, content: newNote.content })

    });

    // We update the state by adding the new note to the existing list
    const responseNote = await response.json();
    setLnotes([responseNote, ...Lnotes]); 
  };

  const deleteNote = async (id) => {
    // 1. Tell the database to delete it
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'DELETE',
    });

    // 2. Update the UI so the note disappears immediately
    setNotes(notes.filter(note => note.id !== id));
  };

  const deleteLnote = async (id) => {

    await fetch(`http://localhost:5000/Lnotes/${id}`, {
      method: 'DELETE',
    });

    const updatedLnote = Lnotes.filter(lnote => lnote.id !== id);
    setLnotes(updatedLnote);
  }

  const toggleTodo = async (id) => {

    // Take current state and loop, for each note if note ID matches, then copy the note but replace the isDone with opposite, otherwise, just return the note.
    // setNotes(prevNotes => prevNotes.map(note => note.id === id ? {...note, isDone: !note.isDone } : note ));
    
    const targetNote = notes.find(n => n.id === id);
    const updateStatus = targetNote.isDone ? 0 : 1;

    const response = await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDone: updateStatus })
    });
    
    if (response.success == true) {
      
      setNotes(prevNotes => prevNotes.map(note => note.id === response.id ? {...note, isDone: response.isDone } : note ));
      
    } else { // This is probably not the most elegant way to set this code, but the idea is to update the TODO first then submit to DB, then update the DB's response back to the client for double-confirmation

      setNotes(prevNotes => prevNotes.map(note => note.id === id ? {...note, isDone: !note.isDone } : note ));

    }


  };
  
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      
      {/* Loop through notes */}

      <ul className="flex flex-col space-y-2">
        {notes.slice().sort((a, b) => a.isDone - b.isDone).map(note => (
          <li key={note.id} className={`flex justify-between p-3 bg-white shadow rounded ${note.isDone ? 'line-through' : ''}`}>
              <div className='flex items-center'>

                <input type="checkbox" id={note.id} className="mr-1" checked={note.isDone} onChange={() => toggleTodo(note.id)}/>
                <span className=''>{note.text}</span>

              </div>

              <div>
                
                <button className='border-2 px-2 py-1 rounded hover:bg-gray-100' onClick={ () => deleteNote(note.id) }>Remove</button>

              </div>
            </li>
        ))}
      </ul>


      <AddNote onAddNote={(inputText) => addNote(inputText) }/>
      
      <br />

      {Lnotes.map(ln => (
        <Note key={ln.id} noteObj={ln} onDelete={deleteLnote}/>
      ))}

      
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Add Note</h1>

          <AddLNote onAdd={(newNote) => addLnote(newNote) } />

          
        </div>

    </div>

    
  )


}

export default App
