import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { Spinner } from "./components/spinner";

export default function Root() {
  let { state } = useNavigation();

  return (
    <main>
      <header>
        <h1>codigofacilito Bootcamp React - Clase de Deploy a Vercel</h1>
      </header>

      {state !== "idle" ? <Spinner /> : null}
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </main>
  );
}
