
import express, { Request, Response } from "express";
import * as NoteService from "./notes.service";
import { BaseNote, Note } from "./interface.note";


export const notesRouter = express.Router();

// get notes /
notesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const notes: Note[] = await NoteService.findAll();

    res.status(200).send(notes);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// get note /:id
notesRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const note: Note = await NoteService.find(id);

    if (note) { return res.status(200).send(note); }

    res.status(404).send("Note not found");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// post note /
notesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const note: BaseNote = req.body;

    const newNote = await NoteService.create(note);

    res.status(201).json(newNote);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// put note /:id
notesRouter.put("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const noteUpdate: Note = req.body;
    const existingNote: Note = await NoteService.find(id);

    if (existingNote) {
      const updatedNote = await NoteService.update(id, noteUpdate);
      return res.status(200).json(updatedNote);
    }
    const newNote = await NoteService.create(noteUpdate);
    res.status(201).json(newNote);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// delete notes /:id
notesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await NoteService.remove(id);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).send(e.message);
  }
});