import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./themes";
import { Root } from "./components/root";
import { Debate } from "./pages/debate";
import { SupabaseContextProvider } from "./context/SupabaseContext";
import { LoginSignUp } from "./pages/loginSignUp";
import { DebateContextProvider } from "./context/DebateContext";
import { MyDebates } from "./components/my-debates";

export const routes = [
  {
    path: "/debate",
    element: <Debate />,
  },
  {
    path: "my-debates",
    element: <MyDebates />,
  },
  {
    path: "login",
    element: <LoginSignUp />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        // The following route to handle redirection from the root path
        index: true,
        element: <Navigate to="/debate" replace />,
      },
      ...routes,
    ],
  },
]);

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <SupabaseContextProvider>
        <DebateContextProvider>
          <RouterProvider router={router} />
        </DebateContextProvider>
      </SupabaseContextProvider>
    </ChakraProvider>
  );
};
