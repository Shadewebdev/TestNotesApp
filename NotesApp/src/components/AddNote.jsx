import { useState } from 'react';

export default function AddNote({ onAddNote, onClearDone }) {

    const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");

    const handleAddClick = () => {
        onAddNote(title);

        setTitle("");
        // setDescription("");
    };

    const handleKeyUp = (event) => {

        if (event.key === 'Enter') {
            handleAddClick();
        }
    }

    return(

        <div className="flex flex-row">

            <input type="text" value={title} placeholder="Task Item" onChange={(e) => setTitle(e.target.value)} onKeyUp={ handleKeyUp } className="border-2 border-gray-50 bg-white rounded shadow px-2 m-2 ml-0 mr-0 mr-1 flex-1 width grow-1 p-[5px] focus:border-blue-500 outline-none transition"/>

            <button className="bg-white rounded shadow m-2 ml-1 mr-0 flex-1 grow-0 justify-right min-w-[100px] hover:bg-gray-100 transition" onClick={ handleAddClick }>Add Task</button>

            <div className='flex flex-col ml-2 mr-2 items-center justify-center'>

                <div className='hover:bg-black/20 opacity-100 rounded-3xl p-[7px] transition relative group' onClick={ onClearDone }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="rgb(100, 100, 100)" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>

                    <div className='absolute top-full left-1/2 -translate-x-3/5 mt-3 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition duration-300 ease-out delay- group-hover:delay-500 w-max px-2 py-1 bg-gray-800/50 text-white text-xs rounded-2xl shadow-lg'>
                    
                        Clear completed notes
                    
                    </div>

                </div>



            </div>

        </div>

    );

}