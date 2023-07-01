import { Grid, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh">
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <Outlet />
      </Grid>
    </Box>
  );
};
