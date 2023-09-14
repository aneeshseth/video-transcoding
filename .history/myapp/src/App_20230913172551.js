import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState()
  return (
    <div>
            <form onSubmit={submit}>
              <input onChange={(e) => setFile(e.target.files[0])} type="file"/>
              <button type="submit" style={{marginLeft: "50px", marginTop: "20px"}}>upload video</button>
            </form>
            </div>
  );
}

export default App;
