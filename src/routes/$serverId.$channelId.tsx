import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { Message, createMessage, listMessages } from "../models/messages";
import { User, listUsers } from "../models/users";

export async function loader({ params }: LoaderFunctionArgs) {
  let channelId = params.channelId;
  if (!channelId) return redirect("/");
  let messages = await listMessages(channelId);
  let users = await listUsers();
  return { messages, users };
}

export async function action({ request, params }: ActionFunctionArgs) {
  let channelId = params.channelId;
  if (!channelId) return redirect("/");

  let users = await listUsers();
  let activeUser = users.find((user) => user.name === "sergiodxa");
  if (!activeUser) throw new Error("Missing active user");

  let formData = await request.formData();

  let content = formData.get("content");
  if (!content) throw new Error("No content");

  let message = await createMessage(
    activeUser.id,
    channelId,
    content as string,
  );

  return { message };
}

export function Component() {
  return (
    <div className="flex-grow flex flex-col w-full">
      <Messages />
      <CreateMessageForm />
    </div>
  );
}

function Messages() {
  let { messages, users } = useLoaderData() as {
    messages: Message[];
    users: User[];
  };

  return (
    <ul className="flex-grow flex flex-col gap-2 p-4 overflow-auto">
      {messages.map((message) => {
        let user = users.find((user) => message.userId === user.id);
        return (
          <li
            key={message.id}
            className="flex flex-col gap-0.5"
            id={message.id}
          >
            <strong className="font-medium">{user?.name ?? "Unknown"}:</strong>
            <p className="pl-4">{message.content}</p>
          </li>
        );
      })}
    </ul>
  );
}

function CreateMessageForm() {
  let navigation = useNavigation();

  return (
    <Form
      method="post"
      className="p-4 flex flex-shrink-0 w-full items-start gap-4"
    >
      <textarea
        name="content"
        rows={1}
        className="border-2 border-slate-300 px-4 py-2 resize-none rounded-lg flex-grow focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:bg-slate-200 duration-200 delay-100"
        disabled={navigation.state !== "idle"}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:bg-slate-200 disabled:text-slate-950 font-medium duration-200 delay-100"
        disabled={navigation.state !== "idle"}
      >
        Send
      </button>
    </Form>
  );
}
