export default function Note({ noteObj, onDelete }) {
    
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-lg">{noteObj?.title || "No title"}</h3>
      <p className="text-gray-600">{noteObj?.content || "No content"}</p>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onDelete(noteObj.id)}>Delete Note</button>
    </div>
  );
}