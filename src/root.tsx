import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { Server, listServers } from "./models/servers";
import clsx from "clsx";

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let servers = await listServers();
  return { servers };
}

export function Component() {
  let { servers } = useLoaderData() as { servers: Server[] };

  return (
    <div className="flex w-full h-screen bg-slate-50">
      <ul className="flex flex-col gap-4 p-4 bg-slate-100 flex-shrink-0">
        {servers.map((server) => {
          return (
            <li key={server.id}>
              <NavLink to={`/${server.id}`}>
                {({ isActive }) => {
                  return (
                    <img
                      src={server.logo}
                      alt={server.name}
                      className={clsx(
                        "size-12 rounded-full transition-all bg-white",
                        {
                          "ring-4 ring-slate-400": isActive,
                          "ring-2 ring-slate-200 hover:ring-slate-300 hover:ring-4":
                            !isActive,
                        },
                      )}
                    />
                  );
                }}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <Outlet />
    </div>
  );
}
