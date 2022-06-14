import { getItem, setItem } from "localforage";
import { notes as seedData } from "../data/notes";
const KEY = "notes";

/**
 * @typedef Note
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} createdAt
 */

export function generateId() {
  return crypto.randomUUID();
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
let sleep = () => {
  return new Promise((resolve) => {
    let ms = Math.round(Math.random() * 100);
    setTimeout(resolve, ms);
  });
};

export async function seedNotes() {
  /** @type {Note[] | null} */
  let notes = await getItem(KEY);
  if (notes !== null && notes.length > 0) return;
  await setItem(KEY, seedData);
}

/**
 * Get all notes in the DB
 * @returns {Promise<Note[]>}
 */
export async function getAllNotes() {
  await sleep();
  /** @type {Note[] | null} */
  let storedValue = await getItem(KEY);
  return storedValue ?? [];
}

/**
 * Get a single note by ID
 * @param {string} id The ID of the note to get
 * @returns {Promise<Note> | Promise<null>}
 */
export async function getNoteById(id) {
  await sleep();
  let notes = await getAllNotes();
  let note = notes.find((note) => note.id === id);
  if (!note) return null;
  return note;
}

/**
 * Create a new note and save it
 * @param {string} title The title of the new note
 * @param {string} body The body of the new note
 * @returns {Promise<Note>}
 */
export async function createNote(title, body) {
  await sleep();
  let id = generateId();
  let createdAt = new Date().toISOString();

  /**
   * @type {Note}
   */
  let note = { id, title, body, createdAt };

  let notes = await getAllNotes();
  notes.push(note);
  await setItem(KEY, notes);
  return note;
}

/**
 * Deletes a note by ID
 * @param {string} id The ID of the note to delete
 * @returns {Promise<void>}
 */
export async function deleteNote(id) {
  await sleep();
  let notes = await getAllNotes();
  let filteredNotes = notes.filter((note) => note.id !== id);
  setItem(KEY, filteredNotes);
}
