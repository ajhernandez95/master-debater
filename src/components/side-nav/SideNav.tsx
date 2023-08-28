import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  IconButton,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useSupabase } from "../../context/SupabaseContext";

const SideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tier, isLoggedIn, supabase } = useSupabase();
  const [isProTier] = useState(tier === "free");
  const [isLoading, setIsLoading] = useState(false);

  const goToHome = () => {
    window.location.href = "/";
  };

  const goToMyDebates = () => {
    window.location.href = "/my-debates";
  };

  const initiateStripePortal = async () => {
    try {
      setIsLoading(true);
      console.log("Creating portal session...");
      const response = await axios.post(
        "https://debateai.jawn.workers.dev/v1/stripe/create-portal-session"
      );

      // Extract the portal URL from the response data and navigate to it
      const portalUrl = response.data.url;
      window.location.href = portalUrl;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  return (
    <>
      <IconButton onClick={onOpen} aria-label="Navigation" icon={<FaBars />} />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Debate AI</DrawerHeader>
          <DrawerBody>
            <Flex
              height="100%"
              direction="column"
              justifyContent="space-between"
            >
              <Flex direction="column" gap={1}>
                <Button
                  variant="ghost"
                  onClick={goToHome}
                  justifyContent="flex-start"
                >
                  Debate
                </Button>
                <Button
                  variant="ghost"
                  onClick={goToMyDebates}
                  justifyContent="flex-start"
                >
                  My Debates
                </Button>
              </Flex>
              <Flex direction="column">
                {isLoggedIn && (
                  <Button
                    variant="link"
                    color="blue.500"
                    onClick={handleSignOut}
                    mb={2}
                  >
                    Sign Out
                  </Button>
                )}
                {isProTier && (
                  <Button
                    variant="link"
                    color="blue.500"
                    onClick={initiateStripePortal}
                    mb={2}
                    isLoading={isLoading}
                  >
                    Manage Membership
                  </Button>
                )}
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideNav;
