
import './App.css';

import axios from 'axios'
import { useState } from 'react'

function App() {
  const [id, setId] = useState();
  const [name, setName] = useState();


  function tryLogin() {

    axios.get(
      'http://localhost:8088/controller/login',
      // get방식으로 데이터를 보낼때는 params 라는 키값으로 묶어서 보낼것
      {
        params: {
          id: id,
          name: name
        }
      }
    )
      .then((res) => {
        console.log(res.data)
      })
    // axios.post(
    //     'http://localhost:8088/controller/login',
    //     {id:id, 
    //     pw:pw}
    // )
    // .then((res)=>{
    //     console.log(res)
    // })
  }
  return (
    <div className="App">

      <h1>Login</h1>
      ID : <input onChange={(e) => setId(e.target.value)}></input>
      <br></br>
      NAME : <input onChange={(e) => setName(e.target.value)}></input>
      <br></br>
      <button onClick={tryLogin}>로그인 시도</button>

    </div>
  );
}

export default App;
