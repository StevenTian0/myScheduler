import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Note from "./note";
import Button from '@mui/material/Button';

function App() {
  //hooks for all note components, new title/desc and number of notes
  const [notes, setNotes] = React.useState([])
  const [newTitle, setNewTitle] = useState('')
  const [numNotes, setNumNotes] = React.useState(0)
  const [newDesc, setNewDescription] = useState('')

  //add new note
  const addNote = () => {
    //update number of notes
    setNumNotes(numNotes + 1)
    if ((newDesc.length + setNewTitle) > 140) {
      window.alert("Note must be less than 140 characters!");
      return null
    }
    //get all the notes
    axios.post(`/api/notes/`, {
      title: newTitle, description: newDesc
    }).then(res => {
      //retrieve a list of notes from the backend
      axios.get("/api/notes/").then((response) => {
        setNotes(response.data.map((curnote) => {
          return < Note data={curnote} met={updatelist} removed={false} />
        }));

      });
    });

    setNewDescription('')
    setNewTitle('')
  };

  //gets all the notes from the database and updates the notes' hook
  const updatelist = (inputid) => {
    axios.get("/api/notes/").then((response) => {
      //update the number of notes by how many the backend returns
      setNumNotes(response.data.length)
      //set all the notes to the elements of the returned list
      setNotes(response.data.map((curnote) => {
        console.log(curnote)
        //key is changed so that all the note components are updated
        return < Note key={inputid + curnote.id} data={curnote} met={updatelist} />
      }));
    });
  };

  //gets all the notes from the database and updates the notes hook on start
  useEffect(() => {
    setNumNotes(0)
    //retrieve a list of notes from the backend
    axios.get("/api/notes/").then((response) => {
      //update the number of notes by how many the backend returns
      setNumNotes(response.data.length)
      setNotes(response.data.map((curnote) => {
        return < Note data={curnote} met={updatelist} removed={false} />
      }));
    });
  }, []);

  //notes is a list of note components
  return (
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
