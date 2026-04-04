import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Home from "./pages/Home";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./pages/ProtectedRoute";

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // staleTime: 0,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
