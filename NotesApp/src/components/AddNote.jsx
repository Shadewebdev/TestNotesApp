import { useState } from 'react';

export default function AddNote({ onAddNote }) {

    const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");

    const handleAddClick = () => {
        onAddNote(title);

        setTitle("");
        // setDescription("");
    };

    return(

        <div className="flex flex-row">

            <input type="text" value={title} placeholder="Task Item" onChange={(e) => setTitle(e.target.value)} className="bg-white border-2 m-2 ml-0 mr-0 flex-1 width grow-1 p-[5px]"/>
            {/* <input type="text" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)}className="bg-white border-2 m-2 ml-1 mr-0 flex-1 width grow-2 p-[5px]"/> */}
            <button className="bg-white border-2 m-2 ml-1 mr-0 flex-1 grow-0 justify-right min-w-[100px] " onClick={ handleAddClick }>Add Task</button>

        </div>

    );

}