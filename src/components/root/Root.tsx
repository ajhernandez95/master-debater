import { Grid, Box, Button } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseContext";
import { SideNav } from "../side-nav";
import { useDebate } from "../../context/DebateContext";

export const Root = () => {
  const { isLoggedIn } = useSupabase();
  const navigate = useNavigate();

  const handleLogIn = () => navigate("/login");

  return (
    <Box textAlign="center" fontSize="xl" overflowY="auto">
      <Box minH="100vh">
        {!isLoggedIn ? (
          <Box display="flex" justifyContent="flex-end" p="2">
            <Button onClick={handleLogIn}>Log In</Button>
          </Box>
        ) : (
          <Box display="flex" p="2">
            <SideNav />
          </Box>
        )}
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <Outlet />
      </Box>
    </Box>
  );
};
