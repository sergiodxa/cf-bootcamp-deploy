import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, DataBrowserRouter } from "react-router-dom";
import { seedNotes } from "./models/notes";

import Root from "./root";
import NotesLayout, { loader as notesLayoutLoader } from "./routes/notes";
import NotesDetail, {
  action as notesDetailAction,
  loader as notesDetailLoader,
} from "./routes/notes/$noteId";
import NoteForm, { action as noteFormAction } from "./routes/notes/new";

seedNotes().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <DataBrowserRouter>
        <Route element={<Root />}>
          <Route
            element={<NotesLayout />}
            path="notes"
            loader={notesLayoutLoader}
          >
            <Route element={<h1>Pick a note at the left</h1>} index />
            <Route element={<NoteForm />} path="new" action={noteFormAction} />
            <Route
              element={<NotesDetail />}
              path=":noteId"
              loader={notesDetailLoader}
              action={notesDetailAction}
              errorElement={<h1>Note not found, select another one</h1>}
            />
          </Route>
          <Route element={<h2>Not Found</h2>} path="*" />
        </Route>
        <Route element={<h2>Not Found</h2>} path="*" />
      </DataBrowserRouter>
    </StrictMode>
  );
});
