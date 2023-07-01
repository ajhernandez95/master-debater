import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./themes";
import { Root } from "./components/root";
import { Debate } from "./pages/debate";

export const routes = [
  {
    path: "/debate",
    element: <Debate />,
  },
  {
    path: "my-debates",
    element: <Root />,
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

export const App = () => (
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
);

/**
 * 1. What are you debating
 * 2. Who are you debating - A professor, a politician, Elon Musk, Santa Clause
 *
 * When debate starts, user can enter their opening arugment which selects their stance or let the AI start and choose stance
 */

/**
 * Debates send request to endpoint with the following data structure
 * [{ role: "user", content: "Say poo" }, { role: “assistant”, content: “Poop is brown”}]
 */
