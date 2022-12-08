import { Suspense } from "react";
import {
  Await,
  defer,
  Form,
  Link,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { Spinner } from "../components/spinner";

import { deleteNote, getNoteById } from "../models/notes";

export async function loader({ params }) {
  return defer({ note: getNoteById(params.noteId) });
}

export async function action({ request }) {
  let formData = await request.formData();
  let noteId = formData.get("id");
  await deleteNote(noteId);

  let { searchParams } = new URL(request.url);
  return redirect(`/notes?${searchParams}`);
}

export default function NotesDetail() {
  let { note } = useLoaderData();
  let [searchParams] = useSearchParams();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={note} errorElement={<h1>Note not found</h1>}>
        {(note) => {
          let date = new Date(note.createdAt);

          return (
            <article>
              <h2>{note.title}</h2>
              <p>{note.body}</p>
              <time dateTime={note.createdAt}>
                {date.toLocaleDateString(window.navigator.languages, {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </time>

              <Form method="post" action={`?${searchParams}`}>
                <input type="hidden" name="id" value={note.id} />
                <button>Delete</button>
              </Form>

              <Link to={`edit?${searchParams}`}>Edit note</Link>
            </article>
          );
        }}
      </Await>
    </Suspense>
  );
}
