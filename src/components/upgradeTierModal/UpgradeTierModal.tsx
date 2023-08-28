import {
  Text,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Switch,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useSupabase } from "../../context/SupabaseContext";
import { Navigate } from "react-router-dom";

export interface UpgradeTierModalProps {
  geniusMode: boolean;
  setGeniusMode: Dispatch<SetStateAction<boolean>>;
}

const initiateStripePurchase = async (redirect = true) => {
  try {
    const response = await axios.post(
      "https://debateai.jawn.workers.dev/api/v1/stripe/create-checkout-session"
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

const UpgradeTierModal = ({
  geniusMode,
  setGeniusMode,
}: UpgradeTierModalProps) => {
  const { user, supabase } = useSupabase();
  const userId = user?.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const handleSwitchToggle = async (e: any) => {
    const value = e.target.checked;
    if (value === true) {
      try {
        const { data } = (await supabase
          .from("profiles")
          .select("plan")
          .eq("id", userId)
          .single()) || { plan: "free" };

        if (data?.plan === "free") {
          onOpen();
        } else {
          setGeniusMode(value);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMaybeLater = () => {
    if (!user) {
      const redirectUrl = initiateStripePurchase(false);
      <Navigate to={`/login?pathRedirect=${redirectUrl}`} />;
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const localStoreGeniusMode =
      localStorage.getItem("geniusMode") &&
      JSON.parse(localStorage.getItem("geniusMode") as string);

    if (localStoreGeniusMode) {
      const parsed = JSON.parse(localStoreGeniusMode);
      setGeniusMode(parsed);
    }
  }, []);

  return (
    <>
      Genius Mode{" "}
      <Switch
        ref={finalRef}
        colorScheme="red"
        isChecked={geniusMode}
        onChange={handleSwitchToggle}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unlock the Power of Genius Mode!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="10px">
              DebateAI is taking a leap forward. With our latest upgrade, you
              can now engage in even more dynamic and insightful debates.
            </Text>
            <Text mb="5px">Why Upgrade?</Text>
            <UnorderedList mb="10px">
              <ListItem>
                Sharper Arguments: Experience deeper insights and more refined
                points.
              </ListItem>
              <ListItem>
                Enhanced Learning: Dive deeper into topics and expand your
                knowledge horizon.
              </ListItem>
              <ListItem>
                Greater Challenge: Push your debating skills further against a
                more advanced AI.
              </ListItem>
            </UnorderedList>

            <Text>
              Take your debates to the next level. Upgrade now and unlock a
              richer, more immersive debating experience!
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Maybe Later
            </Button>
            <Button variant="ghost" onClick={() => initiateStripePurchase()}>
              Upgrade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpgradeTierModal;
