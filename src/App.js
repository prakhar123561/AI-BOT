import { useState } from "react";
const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const handleInputKeyPress = (event) =>{
    if(event.key === 'Enter'){
      getResponse()
    }
  }

  const getResponse = async () => {
    if(!value) {
      setError("Please enter a question")
      return
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      const response = await fetch("http://localhost:8080/gemini/", options)
      const data = await response.text()
      console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: [{ text: value }],
      },
      {
        role: "model",
        parts: [{ text: data }],
      }
    ])
    setValue("")
    }
    catch (error) {
      console.error(error)
      setError("Something went wrong! Plz try again later.")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }
  return (
    <div className="app">
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '10px', flexWrap: 'wrap'}}>
      <p style={{width: '20%', padding: '5px 10px', backgroundColor:'#c3c3c3'}} onClick={(e)=> setValue(e.target.textContent)} disabled={!chatHistory}>
      How do you ensure confidentiality and privacy during therapy?
      </p>
      <p style={{width: '20%', padding: '5px 10px', backgroundColor:'#c3c3c3'}} onClick={(e)=> setValue(e.target.textContent)} disabled={!chatHistory}>
      What are your qualifications and experience as a therapy assistant?
      </p>
      <p style={{width: '20%', padding: '5px 10px', backgroundColor:'#c3c3c3'}} onClick={(e)=> setValue(e.target.textContent)} disabled={!chatHistory}>
      How long will therapy take and how often will I need to attend sessions?
      </p>
      <p style={{width: '20%', padding: '5px 10px', backgroundColor:'#c3c3c3'}} onClick={(e)=> setValue(e.target.textContent)} disabled={!chatHistory}>
      What is the cost of therapy and do you accept insurance?
      </p>
      </div>
       

      <div className="input-container">
        <input type="text" placeholder="Search Anything" value={value} onChange={(e) => setValue(e.target.value)} />
        {!error ? <button onClick={getResponse} onKeyDown={handleInputKeyPress}>&#10146;</button> : <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}

      <div className="search-result">
        {chatHistory.map((chatItem, _index) => <div key={_index}>
          <p className="answer">{chatItem.role}: {chatItem.parts[0].text}</p>
        </div>)}
      </div>


    </div>
  );
}

export default App
