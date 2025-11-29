import {useEffect,useState} from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export default function App(){
    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [lessons, setLessons] = useState([]);
    const [selectedLesson ,setSelectedLesson] = useState("");
    const [score ,setScore] =useState("");
    useEffect(() => {
        fetch(`${backendUrl}/names`)
          .then(res => res.json())
          .then(data => setNames(data.names))
          .catch(err => console.error(err));
    
        fetch(`${backendUrl}/courses`)
          .then(res => res.json())
          .then(data => setLessons(data.courses))
          .catch(err => console.error(err));
    }, []);
    useEffect(() => {
    if (!selectedName || !selectedLesson) {
        setScore("");
        return;
    }
    fetch(`${backendUrl}/score?a=${selectedName}&b=${selectedLesson}`)
      .then((res) => res.json())
      .then((data) => setScore(data.score))
      .catch((err) => console.error(err));
    }, [selectedName, selectedLesson]);
    
    function handleSubmit(e) {
      e.preventDefault();
      fetch(`${backendUrl}/change?esm=${selectedName}&lesson=${selectedLesson}&score=${Number(score)}`, {
        method: "POST"
      }).then(() => {alert("Score successfully recorded.")})
    }
    
    return(
      <div className="relative flex flex-col items-center justify-center min-h-screen w-screen"> 
        <div className="absolute inset-0 bg-contain bg-center opacity-20 pointer-events-none" style={{ backgroundImage: "url('/background.jpg')" }}>
        </div>
        <h1 className="font-montserrat font-bold text-4xl text-white">ATU</h1>
        <h3 className="font-montserrat font-light text-xl text-gray-400">Allameh Tabatabaei University</h3>
        <h2 className="font-montserrat font-semibold mb-2">Grade entry system</h2>
        <div className=" bg-black p-4 rounded-3xl text-center">
            <form>
              <Names names={names} selectedName={selectedName} setSelectedName={setSelectedName}/>
              <Lessons lessons={lessons} selectedLesson={selectedLesson} setSelectedLesson={setSelectedLesson}/>
            </form>
            <form onSubmit={handleSubmit}>
              <Score score={score} setScore={setScore} selectedName={selectedName} selectedLesson={selectedLesson}/>
              <button className="w-28 mt-4 rounded-3xl px-8 text-white bg-green-500 hover:bg-green-700 hover:text-gray-400" type="submit">Submit</button>
            </form>
        </div>
      </div>
    )
}
function Names({names, selectedName, setSelectedName}){
  return(
    <>
      <h6 className="font-montserrat font-extralight text-xs">student name</h6>
      <label>
        <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} className="mt-1 p-1 rounded-3xl border border-gray-300 bg-black text-white font-montserrat">
          <option value="">Choose a name</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
          </option>      
            ))} 
        </select>
      </label><br/>
    </>
  )
}
function Lessons({lessons, selectedLesson, setSelectedLesson}){
  return(
    <>
      <h6 className="font-montserrat font-extralight text-xs mt-4">course name</h6>
      <label>
        <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)} className="mt-1 p-1 rounded-3xl border border-gray-300 bg-black text-white font-montserrat">
          <option value="">Choose a lesson</option>
            {lessons.map((lesson) =>(
              <option key={lesson} value={lesson}>
                {lesson}
              </option>
            ))}
        </select>
      </label><br/>
    </>
  )
}
function Score({score, setScore, selectedName, selectedLesson}){
    return(
        <>
            <h6 className="font-montserrat font-extralight text-xs mt-4">Enter new score:</h6>
            <label>
                <input className="w-40 px-5 mt-1 p-1 rounded-3xl border border-gray-300 bg-black text-white font-montserrat text-center" type="number" value={score} onChange={(e) => setScore(e.target.value)} disabled={!selectedName || !selectedLesson}>
                </input>
            </label><br/>
        </>
    )
}
