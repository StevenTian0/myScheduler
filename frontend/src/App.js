import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Note from "./note";
import Button from '@mui/material/Button';



function App() {

  const [notes, setNotes] = React.useState([])
  const [newTitle, setNewTitle] = useState('')
  const [numNotes, setNumNotes] = React.useState(0)
  const [newDesc, setNewDescription] = useState('')

  const addNote = () => {
    setNumNotes(numNotes + 1)
    if ((newDesc.length + setNewTitle) > 140) {
      window.alert("Note must be less than 140 characters!");
      return null
    }
    axios.post(`/api/notes/`, {
      title: newTitle, description: newDesc
    }).then(res => {
      axios.get("/api/notes/").then((response) => {
        setNotes(response.data.map((curnote) => {
          return < Note data={curnote} met={updatelist} removed={false} />
        }));

      });
    });

    setNewDescription('')
    setNewTitle('')
  };

  const updatelist = (inputid) => {
    setNotes(null)
    axios.get("/api/notes/").then((response) => {
      setNumNotes(response.data.length)
      setNotes(response.data.map((curnote) => {
        console.log(curnote)
        return < Note data={curnote} met={updatelist} />
      }));

    });
  };

  useEffect(() => {
    setNumNotes(0)
    axios.get("/api/notes/").then((response) => {
      setNumNotes(response.data.length)
      setNotes(response.data.map((curnote) => {
        return < Note data={curnote} met={updatelist} removed={false} />
      }));
    });
  }, []);


  return (
    // "fake html JSX"
    <div>
      <div className="top">
        <h1>{numNotes} Notes:</h1>
        <p>Double click on a note's text to edit!</p>

      </div>

      <ul>{notes}</ul>
      <div className="card">
        <h3>Add new note:</h3>
        <form onSubmit={() => addNote()}>
          <input type='title' onChange={event => setNewTitle(event.target.value)} placeholder="Title" value={newTitle} />
          <textarea type='text' onChange={event => setNewDescription(event.target.value)} placeholder="Lorem ipsum dolor etc" value={newDesc} />
        </form>
        <Button variant="outlined" onClick={() => addNote()}> Add </Button>

      </div>

    </div>
  );
}
export default App;