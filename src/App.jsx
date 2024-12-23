import "./index.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import UrlProvider from "./context";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layouts/app-layout";
import RequireAuth from "./components/require-auth";

import RedirectLink from "./pages/redirect-link";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import LinkPage from "./pages/link";
import Auth from "./pages/auth";
import ResetPassword from "./components/reset-pass";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkPage />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
      {
        path : "/forgot-password",
        element : <ResetPassword />
      }
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <Toaster/>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
