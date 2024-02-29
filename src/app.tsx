import { Spinner } from "./components/spinner";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    lazy: () => import("./root"),
    children: [
      {
        index: true,
        lazy: () => import("./routes/_index"),
      },
      {
        path: ":serverId",
        lazy: () => import("./routes/$serverId"),
        children: [
          {
            index: true,
            lazy: () => import("./routes/$serverId._index"),
          },
          {
            path: ":channelId",
            lazy: () => import("./routes/$serverId.$channelId"),
          },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="flex w-full h-screen bg-slate-50 items-center justify-center">
          <Spinner className="size-20" />
        </div>
      }
    />
  );
}
