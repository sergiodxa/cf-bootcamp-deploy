import { redirect } from "react-router-dom";
import { listServers } from "../models/servers";

export async function loader() {
  let servers = await listServers();
  return redirect(`/${servers[0].id}`);
}
