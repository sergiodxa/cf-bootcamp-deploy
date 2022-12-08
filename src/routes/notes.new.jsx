import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { createNote } from "../models/notes";

export async function action({ request }) {
  let { searchParams } = new URL(request.url);

  let formData = await request.formData();

  let title = formData.get("title");

  if (title.length < 3) {
    return json({ message: "Title is too short" });
  }

  let body = formData.get("body");

  let note = await createNote(title, body);

  return redirect(`/notes/${note.id}?${searchParams}`);
}

export default function NoteForm() {
  let note = useLoaderData();
  let [searchParams] = useSearchParams();
  let actionData = useActionData();
  let { key } = useLocation();

  return (
    <Form method="post" action={`?${searchParams}`}>
      <h2>Note form</h2>

      {actionData ? <p>{actionData.message}</p> : null}

      <label>
        Title
        <input
          type="text"
          name="title"
          required
          defaultValue={note?.title}
          key={key}
        />
      </label>

      <label>
        Body
        <textarea name="body" required defaultValue={note?.body} key={key} />
      </label>

      <button>Submit</button>
    </Form>
  );
}
