import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Spinner } from "./components/spinner";
import { seedNotes } from "./models/notes";
import { fakeNetwork } from "./utils/sleep";

import "./styles/global.css";

const Root = lazy(() => fakeNetwork().then(() => import("./root")));

const NotesLayout = lazy(() =>
  fakeNetwork().then(() => import("./routes/notes"))
);

const NotesDetail = lazy(() =>
  fakeNetwork().then(() => import("./routes/notes.$noteId"))
);

const NoteForm = lazy(() =>
  fakeNetwork().then(() => import("./routes/notes.new"))
);

function lazyLoader(factory) {
  return async (args) => {
    let { loader } = await factory();
    return loader(args);
  };
}

function lazyAction(factory) {
  return async (args) => {
    let { action } = await factory();
    return action(args);
  };
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { index: true, element: <Navigate to="notes" /> },
      {
        path: "notes",
        element: <NotesLayout />,
        loader: lazyLoader(() => import("./routes/notes")),
        children: [
          { index: true, element: <h1>Pick a note at the left</h1> },
          {
            path: "new",
            element: <NoteForm />,
            action: lazyAction(() => import("./routes/notes.new")),
          },
          {
            path: ":noteId",
            element: <NotesDetail />,
            loader: lazyLoader(() => import("./routes/notes.$noteId")),
            action: lazyAction(() => import("./routes/notes.$noteId")),
            errorElement: <h1>Note not found</h1>,
          },
          {
            path: ":noteId/edit",
            element: <NoteForm />,
            loader: lazyLoader(() => import("./routes/notes.$noteId.edit")),
            action: lazyAction(() => import("./routes/notes.$noteId.edit")),
          },
        ],
      },
      { path: "*", element: <h1>Not found</h1> },
    ],
  },
]);

seedNotes().then(() => {
  return createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} fallbackElement={<Spinner />} />
      </Suspense>
    </StrictMode>
  );
})
