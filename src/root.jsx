import { Outlet, useNavigation } from "react-router-dom";
import "./styles/global.css";

export default function Root() {
  let navigation = useNavigation();

  return (
    <main>
      <header>
        <h1>codigofacilito Bootcamp React - Clase de Deploy a Vercel</h1>
      </header>
      <Outlet />
      {navigation.state !== "idle" && (
        <p style={{ position: "fixed", top: 16, right: 16 }}>Loading...</p>
      )}
    </main>
  );
}
