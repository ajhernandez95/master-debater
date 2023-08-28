import { Box, Card, CardBody } from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabase } from "../../context/SupabaseContext";
import useStyles from "./hooks/useStyles";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const LoginSignUp = () => {
  const { isLoggedIn, supabase, isFreeTier } = useSupabase();
  const { boxStyles, cardStyles } = useStyles();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const pathRedirect = query.get("pathRedirect");
  const redirectToUpgrade = query.get("redirectToUpgrade");
  const path = pathRedirect ? pathRedirect : "/";

  const initiateStripePurchase = async (redirect = true) => {
    try {
      const response = await axios.post(
        "https://debateai.jawn.workers.dev/v1/stripe/create-checkout-session"
      );

      // Extract the checkout URL from the response data and navigate to it
      const checkoutUrl = response.data.url;

      if (redirect) {
        window.location.href = checkoutUrl;
      } else {
        return checkoutUrl;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  if (isLoggedIn) {
    if (isFreeTier && redirectToUpgrade) {
      initiateStripePurchase();
    } else {
      return <Navigate to={path} />;
    }
  }

  return (
    <Box minH="90vh" display="flex" justifyContent="center" alignItems="center">
      <Box {...boxStyles}>
        <Card {...cardStyles}>
          <CardBody>
            <Auth
              supabaseClient={supabase}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
              }}
              theme="dark"
            />
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginSignUp;
