import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Note from './components/note';
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

  const [lnotes, setLnotes] = useState([
    { id: 1, title: "My first note", content: "Hey there this is a test!"},
    { id: 2, title: "Second note", content: "This is the second note."}
  ]);

  const addLnote = (newNote) => {
    // We update the state by adding the new note to the existing list
    setLnotes([newNote, ...lnotes]); 
  };

  const deleteNote = async (id) => {
    // 1. Tell the database to delete it
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'DELETE',
    });

    // 2. Update the UI so the note disappears immediately
    setNotes(notes.filter(note => note.id !== id));
  };

  const deleteLnote = (id) => {
    const updatedLnote = lnotes.filter(lnote => lnote.id !== id);
    setLnotes(updatedLnote);
  }

  const toggleTodo = (id) => {

    // Take current state and loop, for each note if note ID matches, then copy the note but replace the isDone with opposite, otherwise, just return the note.
    setNotes(prevNotes => prevNotes.map(note => note.id === id ? {...note, isDone: !note.isDone } : note ));

  };
  
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      
      {/* Loop through notes */}

      <ul className="flex flex-col space-y-2">
        {notes.map(note => (
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
      {lnotes.map(ln => (
        <Note key={ln.id} noteObj={ln} onDelete={deleteLnote}/>
      ))}

      
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Add Note</h1>
          
          {/* 1. Show the Form */}
          <AddLNote onAdd={addLnote} />

          {/* 2. Show the List */}
          {/* <div className="space-y-4">
            {lnotes.map(lnote => (
              <Note key={lnote.id} noteObj={lnote} onDelete={deleteLnote}/>
            ))}
          </div> */}
        </div>

    </div>

    
  )


}

export default App
