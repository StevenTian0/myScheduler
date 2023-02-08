/**
 * Data Model Interfaces
 */
import { BaseNote, Note } from "./interface.note";
import { Notes } from "./notes.interface";

/**
 * In-Memory Store
 */
let notes: Notes = {
  1: {
    id: 1,
    title: "Note 1",
    description: "Lorem1 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inc.",
  },
  2: {
    id: 2,
    title: "Sam's number",
    description: "514-123-3456",
  },
  3: {
    id: 3,
    title: "Grocery List",
    description: "Avocados, Milk, Baguette",
  },

};

/**
 * Service Methods
 */
export const findAll = async (): Promise<Note[]> => Object.values(notes);

export const find = async (id: number): Promise<Note> => notes[id];

export const create = async (newItem: BaseNote): Promise<Note> => {
  const id = new Date().valueOf();

  notes[id] = {
    id,
    ...newItem,
  };

  return notes[id];
};

export const update = async (
  id: number,
  itemUpdate: BaseNote
): Promise<Note | null> => {
  const item = await find(id);

  if (!item) {
    return null;
  }

  notes[id] = { id, ...itemUpdate };

  return notes[id];
};

export const remove = async (id: number): Promise<null | void> => {
  const item = await find(id);

  if (!item) {
    return null;
  }

  delete notes[id];
};