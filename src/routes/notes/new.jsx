import {
  Form,
  redirect,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { createNote } from "../../models/notes";

export default function NoteForm() {
  let [searchParams] = useSearchParams();
  let navigation = useNavigation();

  return (
    <Form method="post" action={`?${searchParams}`}>
      <h2>Create a new note</h2>

      <label>
        Title
        <input type="text" name="title" required />
      </label>

      <label>
        Body
        <textarea name="body" required />
      </label>

      <button disabled={navigation.state !== "idle"}>Create</button>
    </Form>
  );
}

/**
 *
 * @param {import("@remix-run/router/utils").DataFunctionArgs} args
 * @returns
 */
export async function action({ request }) {
  let { searchParams } = new URL(request.url);
  let formData = await request.formData();
  let { id } = await createNote(formData.get("title"), formData.get("body"));
  return redirect(`/notes/${id}?${searchParams}`);
}
