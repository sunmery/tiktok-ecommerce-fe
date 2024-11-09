import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch(`http://localhost:8000/v1/create_user`,{
      method: 'PUT',
      headers:{"Context-Type":"application/json"},
      body: JSON.stringify({count}),
    }).then(res => res.json())
      .then(data=>{
        console.log(data)
      }).catch(err=>console.error(err))
  },[])

  return (
    <>

    </>
  )
}

export default App
