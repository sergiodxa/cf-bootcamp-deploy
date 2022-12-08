import { json, redirect } from "react-router-dom";

export { default } from "./notes.new";

import { getNoteById, updateNote } from "../models/notes";

export async function loader({ params }) {
  let note = await getNoteById(params.noteId);
  return json(note);
}

export async function action({ request, params }) {
  let formData = await request.formData();
  let noteId = params.noteId;
  let title = formData.get("title");
  let body = formData.get("body");

  if (title.length < 3) {
    return json({ message: "Title is too short" });
  }

  await updateNote(noteId, title, body);

  let { searchParams } = new URL(request.url);

  return redirect(`/notes/${noteId}?${searchParams}`);
}
