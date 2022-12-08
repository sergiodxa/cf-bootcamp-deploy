import { Suspense } from "react";
import {
  Form,
  json,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { Spinner } from "../components/spinner";
import { getAllNotes } from "../models/notes";

export async function loader({ request }) {
  let notes = await getAllNotes();

  let url = new URL(request.url);

  let sort = url.searchParams.get("sort") ?? "id";
  let dir = url.searchParams.get("dir") ?? "desc";

  let sorted = [...notes].sort((noteA, noteB) => {
    if (sort in noteA) {
      if (dir === "desc") return noteA[sort].localeCompare(noteB[sort]);
      else return noteB[sort].localeCompare(noteA[sort]);
    } else {
      if (dir === "desc") return noteA.id.localeCompare(noteB.id);
      else return noteB.id.localeCompare(noteA.id);
    }
  });

  return json(sorted);
}

export default function NotesLayout() {
  let notes = useLoaderData();
  let { pathname } = useLocation();
  let [searchParams] = useSearchParams();
  let submit = useSubmit();

  let sort = searchParams.get("sort") ?? "id";
  let dir = searchParams.get("dir") ?? "desc";

  return (
    <section>
      <nav>
        <Form
          action={pathname}
          onChange={(event) => {
            submit(event.currentTarget, { action: pathname });
          }}
        >
          <label>
            Sort by:
            <select name="sort" defaultValue={sort}>
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="body">Body</option>
              <option value="createdAt">Created at</option>
            </select>
          </label>

          <label>
            Direction:
            <select name="dir" defaultValue={dir}>
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
                <NavLink to={`${note.id}?${searchParams}`}>
                  {note.title}
                </NavLink>
              </li>
            );
          })}

          <li>
            <button onClick={() => setNoteId("RANDOM")}>
              Not found example
            </button>
          </li>
        </ul>
      </nav>

      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </section>
  );
}
