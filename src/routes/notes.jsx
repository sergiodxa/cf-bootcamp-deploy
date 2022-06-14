import {
  Form,
  json,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { getAllNotes } from "../models/notes";

export default function NotesLayout() {
  /**
   * @type {Record<string, import("./models/notes").Note[]>}
   */
  let { notes } = useLoaderData();
  let [searchParams] = useSearchParams();
  let { pathname } = useLocation();

  return (
    <section>
      <nav>
        <Form method="get" action={pathname}>
          <label>
            Sort by:
            <select name="sort" defaultValue={searchParams.get("sort")}>
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="body">Body</option>
              <option value="createdAt">Created at</option>
            </select>
          </label>

          <label>
            Direction:
            <select name="dir" defaultValue={searchParams.get("dir")}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>

          <button>Sort</button>
        </Form>

        <ul>
          <li>
            <Link to={`new?${searchParams}`}>Create a note</Link>
          </li>

          {notes.map((note) => {
            return (
              <li key={note.id}>
                <Link to={`${note.id}?${searchParams}`}>{note.title}</Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Outlet />
    </section>
  );
}

/**
 *
 * @param {import("@remix-run/router/utils").DataFunctionArgs} args
 * @returns
 */
export async function loader({ request }) {
  let { searchParams } = new URL(request.url);
  let sort = searchParams.get("sort") || "id";
  let dir = searchParams.get("dir") || "desc";

  let notes = await getAllNotes();

  let sorted = notes.sort((noteA, noteB) => {
    if (sort in noteA) {
      if (dir === "desc") {
        return noteA[sort].localeCompare(noteB[sort]);
      } else return noteB[sort].localeCompare(noteA[sort]);
    } else {
      if (dir === "desc") return noteA.id.localeCompare(noteB.id);
      else return noteB.id.localeCompare(noteA.id);
    }
  });

  return json({ notes: sorted });
}
