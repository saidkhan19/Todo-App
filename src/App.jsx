import { BrowserRouter, Route, Routes } from "react-router";

import Layout from "./layout/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./components/Notifications";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import Profile from "./components/Profile";

function App() {
  return (
    <BrowserRouter>
      <Notifications />

      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
