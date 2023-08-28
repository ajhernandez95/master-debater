import { Box, Card, CardBody } from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabase } from "../../context/SupabaseContext";
import useStyles from "./hooks/useStyles";
import { Navigate, useLocation } from "react-router-dom";

const LoginSignUp = () => {
  const { isLoggedIn, supabase } = useSupabase();
  const { boxStyles, cardStyles } = useStyles();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const pathRedirect = query.get("pathRedirect");
  const path = pathRedirect ? pathRedirect : "/";

  if (isLoggedIn) {
    return <Navigate to={path} />;
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
