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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useSupabase } from "../../context/SupabaseContext";
import { Navigate } from "react-router-dom";

export interface UpgradeTierModalProps {
  geniusMode: boolean;
  setGeniusMode: Dispatch<SetStateAction<boolean>>;
}

const UpgradeTierModal = ({
  geniusMode,
  setGeniusMode,
}: UpgradeTierModalProps) => {
  const { user, supabase, tier } = useSupabase();
  const [proMessageCount, setProMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const handleSwitchToggle = async (e: any) => {
    const value = e.target.checked;
    if (value === true) {
      try {
        if (tier === "free") {
          onOpen();
        } else {
          setGeniusMode(value);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setGeniusMode(value);
    }
  };

  const initiateStripePurchase = async (redirect = true) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getProTrialCount = async () => {
    const trialCountUsed = await supabase
      .from("profiles")
      .select("pro_trial_count")
      .eq("id", user?.id)
      .single();
    setProMessageCount(trialCountUsed.data?.pro_trial_count);
  };

  const handleMaybeLater = () => {
    if (proMessageCount < 5) {
      setGeniusMode(true);
    } else {
      setGeniusMode(false);
    }
    onClose();
  };

  useEffect(() => {
    const localStoreGeniusMode =
      localStorage.getItem("geniusMode") &&
      JSON.parse(localStorage.getItem("geniusMode") as string);

    if (localStoreGeniusMode) {
      const parsed = JSON.parse(localStoreGeniusMode);
      setGeniusMode(parsed);
    }

    getProTrialCount();
  }, []);

  return (
    <>
      Genius Mode{" "}
      <Switch
        ref={finalRef}
        colorScheme="blue"
        isChecked={geniusMode}
        onChange={handleSwitchToggle}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unlock the Power of Genius Mode!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="5px">Why Upgrade?</Text>
            <UnorderedList mb="10px">
              <ListItem>
                <b>Genius Mode</b>: Create unlimited debates using Genius Mode.
              </ListItem>
              <ListItem>
                <b>Save Debates</b>: Re-live your past debates or resume them at
                any point.
              </ListItem>
              <ListItem>
                <b>Sharper Arguments</b>: Experience deeper insights and more
                refined points.
              </ListItem>
              <ListItem>
                <b>Greater Challenge</b>: Push your debating skills further
                against a more advanced AI.
              </ListItem>
            </UnorderedList>
            <Text>
              {proMessageCount}/5 free Genius Mode debate messages used
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleMaybeLater}>
              Maybe Later
            </Button>
            <Button
              variant="ghost"
              onClick={() => initiateStripePurchase()}
              isLoading={isLoading}
            >
              Upgrade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpgradeTierModal;
