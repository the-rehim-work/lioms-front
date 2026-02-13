import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import ProjectView from "@/pages/ProjectView";
import Companies from "@/pages/Companies";
import Plans from "@/pages/Plans";
import States from "@/pages/States";
import Details from "@/pages/Details";
import FunctionalFields from "@/pages/FunctionalFields";
import Users from "@/pages/Users";
import Layout from "@/components/Layout";
import Protected from "@/app/Protected";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: (
      <Protected>
        <Layout />
      </Protected>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectView /> },
      { path: "companies", element: <Companies /> },
      { path: "plans", element: <Plans /> },
      { path: "states", element: <States /> },
      { path: "details", element: <Details /> },
      { path: "functional-fields", element: <FunctionalFields /> },
      { path: "users", element: <Users /> },
    ],
  },
]);