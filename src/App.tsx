
import "./index.css";
import { AppLayout } from "./layouts/app-layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { LogOut } from "./pages/logout";
import { Reference } from "./pages/reference";
import { Route, Routes } from "./route";

export function App() {
  return (
    <Routes>
      <Route path="home" element={<Home />}></Route>
      <Route path="reference" element={<Reference />}></Route>
      <Route path="logout" element={<LogOut />} />
      <Route path="login" element={<Login />}/>
    </Routes>

  );
}

export default App;
