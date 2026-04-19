export default function Note({ noteObj, onDelete }) {
    
  return (
    <div className="flex flex-col items-center">
      <div className="p-4 border border-gray-50 rounded-xl shadow-sm bg-white mb-3 w-2/3 flex flex-col gap-2">

        <h3 className="font-bold text-lg">{noteObj?.title || "No title"}</h3>
        <p className="text-gray-600">{noteObj?.content || "No content"}</p>
        <div className="flex grow-0">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition" onClick={() => onDelete(noteObj.id)}>Remove Note</button>
        </div>

      </div>
    </div>
  );
}