import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import useUpdateHtmlLanguage from "./hooks/useUpdateHtmlLanguage";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./components/Notifications";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import DataProviderRoute from "./components/DataProviders/DataProviderRoute";
import FullPageSpinner from "./components/UI/FullPageSpinner/FullPageSpinner";

const Auth = lazy(() => import("./components/Auth"));
const Home = lazy(() => import("./components/Home"));
const Projects = lazy(() => import("./components/Projects"));
const Tasks = lazy(() => import("./components/Tasks"));
const Profile = lazy(() => import("./components/Profile"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  useUpdateHtmlLanguage();

  return (
    <BrowserRouter>
      <Notifications />

      <ErrorBoundary>
        <Suspense fallback={<FullPageSpinner />}>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DataProviderRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
