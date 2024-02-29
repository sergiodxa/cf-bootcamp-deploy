import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { listChannels } from "../models/channels";

export async function loader({ params }: LoaderFunctionArgs) {
  let serverId = params.serverId;
  if (!serverId) return redirect("/");
  let channels = await listChannels(serverId);
  return redirect(`/${serverId}/${channels[0].id}`);
}
