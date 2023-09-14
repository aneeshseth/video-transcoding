import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState()
  const submit = async (event) => {
    try {
      event.preventDefault()
      const formData = new FormData()
      formData.append("image", file)
      const setProfilePic = await axios.post("http://localhost:3010/api/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const data = await setProfilePic.data;
      setProfileForNow(data.image)
      alert("Profile picture has been set!")
    } catch (err) {
      console.log(err)
    }
  }
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
