import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Note from './components/Note';
import AddLNote from './components/AddLNote';
import AddNote from './components/AddNote';
import './App.css'

// Okay so I know calling ToDo "notes" and notes "Lnotes" is a horrible naming scheme, that was a major oversight when starting the project :sob:

function App() {

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

  const [isSaving, setIsSaving] = useState(false);
  // Connecting to SQLite3 DB through Express.js backend.
  const addNote = async (inputText) => {

    setIsSaving(true);

    try {

      const response = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      
      const newNote = await response.json();
      setNotes([...notes, newNote]); // Update UI with the note the server just created

    } catch (error) {

      console.error("Failed to save: ", error);

    } finally {

      setIsSaving(false);

    }
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

  const [filterText, setFilterText] = useState("");

  const handleFilterText = (text) => {

    setFilterText(text)
    
    if (!text === "") {

    }

  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(filterText.toLowerCase())
  );

  const clearCompletedNotes = async () => {

    const response = await fetch(`http://localhost:5000/notes/completed`, {
      method: 'DELETE',
    });

    if (response.ok) {

      setNotes(notes.filter(note => note.isDone == 0));

    } else {

      alert("Something went wrong on the server.");

    }


  }
  
// --------------------------------------------------------------------------------------------------------------------

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      
      <h1 className="inline-block text-2xl font-bold mb-4 font-mono group/title"><span className='group-hover/title:tracking-[10px] transition-all ease-in-out duration-300'>| </span> My To-Dos</h1>
        <div className='relative max-w-sm float-right'>

          <div className='absolute flex items-center inset-y-0 left-0 pl-3 pointer-events-none'> {/* Filter icon */}

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>


          </div>

          <input type="text" value={filterText} placeholder='Filter by text...' onChange={ (e) => handleFilterText(e.target.value) } className='border border-gray-50 bg-white w-50 shadow rounded-2xl px-3 pl-10 py-1 text-sm focus:border-gray-300 outline-none transition-all focus:w-[20em]'/>

        </div>

      
      {/* Loop through notes */}

      <ul className="flex flex-col space-y-2">
        {/* .slice() creates a shallow copy, .sort() sorts between two items, and the result of those two items determines the order. */}
        {filteredNotes.slice().sort((a, b) => a.isDone - b.isDone).map(note => (
          <li key={note.id} className={`flex justify-between p-3 bg-white shadow rounded ${note.isDone ? 'line-through' : ''}`}>
              <div className='flex items-center'>

                <input type="checkbox" id={note.id} className="mr-2" checked={note.isDone} onChange={() => toggleTodo(note.id)}/>
                <span className=''>{note.text}</span>

              </div>

              <div>
                
                <button className='border-1 border-gray-100 shadow px-3 py-1 rounded-3xl hover:bg-blue-500 hover:text-white transition' onClick={ () => deleteNote(note.id) }>Remove</button>

              </div>
            </li>
        ))}

        { notes.length === 0 && <p className='mt-5'>No items. Add new ones at the bottom.</p>}

      </ul>


      <AddNote onAddNote={(inputText) => addNote(inputText) } onClearDone={ () => clearCompletedNotes() } />
      {isSaving && (
        <div className="text-blue-500 text-sm italic mb-2">
            Saving to database...
        </div>
      )}
      
      <br />

      <h1 className="inline-block text-2xl font-bold mb-4 font-mono group/notesTitle"><span className=' group-hover/notesTitle:tracking-[10px] transition-all ease-in-out duration-300'>| </span> My Notes</h1>
      
      <br />

      {Lnotes.map(ln => (
        <Note key={ln.id} noteObj={ln} onDelete={deleteLnote}/>
      ))}

      
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-xl font-mono">- new note -</h1>

          <AddLNote onAdd={(newNote) => addLnote(newNote) } />

          
        </div>

    </div>

    
  )


}

export default App
