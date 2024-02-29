import {
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { Channel, listChannels } from "../models/channels";
import clsx from "clsx";

export async function loader({ params }: LoaderFunctionArgs) {
  let serverId = params.serverId;
  if (!serverId) return redirect("/");
  let channels = await listChannels(serverId);
  return { channels };
}

export function Component() {
  let { channels } = useLoaderData() as { channels: Channel[] };
  let { serverId } = useParams<{ serverId: string }>();

  return (
    <>
      <ul className="flex-grow flex-shrink-0 w-full max-w-xs bg-slate-200 text-slate-950 p-4">
        {channels.map((channel) => (
          <li key={channel.id}>
            <NavLink
              to={`/${serverId}/${channel.id}`}
              className={({ isActive }) => clsx({ "font-medium": isActive })}
            >
              {channel.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <Outlet />
    </>
  );
}
