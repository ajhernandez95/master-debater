import { Box, Button, Badge } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseContext";
import { SideNav } from "../side-nav";
import axios from "axios";
import useStripe from "../../hooks/useStripe";

export const Root = () => {
  const { isLoggedIn, tier } = useSupabase();
  const isFreeTier = tier === "free";

  const { initiateStripePurchase } = useStripe();
  const tierColorScheme = isFreeTier ? "default" : "pink";
  const tierLable = isFreeTier ? "Upgrade to Pro" : "Pro";
  const navigate = useNavigate();

  const handleLogIn = () => navigate("/login");

  // const initiateStripePurchase = async () => {
  //   if (!isFreeTier) return;
  //   try {
  //     const response = await axios.post(
  //       "https://debateai.jawn.workers.dev/v1/stripe/create-checkout-session"
  //     );

  //     // Extract the checkout URL from the response data and navigate to it
  //     const checkoutUrl = response.data.url;

  //     window.location.href = checkoutUrl;
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  return (
    <Box textAlign="center" fontSize="xl" overflowY="auto">
      <Box minH="100vh">
        {!isLoggedIn ? (
          <Box display="flex" justifyContent="space-between" p="2">
            <SideNav />
            <Button onClick={handleLogIn}>Log In</Button>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="2"
          >
            <SideNav />
            <Badge
              onClick={initiateStripePurchase}
              ml="1"
              fontSize="0.8em"
              colorScheme={tierColorScheme}
              cursor={isFreeTier ? "pointer" : "default"}
            >
              {tierLable}
            </Badge>
          </Box>
        )}
        <Outlet />
      </Box>
    </Box>
  );
};
