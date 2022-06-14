import {
  Form,
  json,
  redirect,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { deleteNote, getNoteById } from "../../models/notes";

export default function NotesDetail() {
  /**
   * @type {Record<string, import("./models/notes").Note>}
   */
  let { note } = useLoaderData();
  let [searchParams] = useSearchParams();
  let navigation = useNavigation();

  if (!note) {
    return <h1>Note not found, select another one</h1>;
  }

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
        <button disabled={navigation.state !== "idle"}>Delete</button>
      </Form>
    </article>
  );
}

/**
 *
 * @param {import("@remix-run/router/utils").DataFunctionArgs} args
 * @returns
 */
export async function loader({ params }) {
  let note = await getNoteById(params.noteId);
  if (!note) return json({ note: null }, { status: 404 });
  return json({ note });
}

/**
 *
 * @param {import("@remix-run/router/utils").DataFunctionArgs} args
 * @returns
 */
export async function action({ request }) {
  let { searchParams } = new URL(request.url);
  let formData = await request.formData();
  await deleteNote(formData.get("id"));
  return redirect(`/notes/?${searchParams}`);
}
