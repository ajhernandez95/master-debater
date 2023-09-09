import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

import { getRandomTopic, getRandomPersona } from "../../utils/debatConfig";
import { UpgradeTierModal } from "../upgrade-tier-modal";
import axios from "axios";
import useUserId from "../../hooks/useUserId";
import { useSupabase } from "../../context/SupabaseContext";
import { useDebate } from "../../context/DebateContext";
import { SignUpModal } from "../sign-up-modal";

interface DebateConfigProps {
  setDebateConfig: (debateConfig: any) => void;
  setStartDebate: (start: boolean) => void;
}

type Inputs = {
  topic: string;
  persona: string;
  geniusMode: boolean;
};

export const DebateConfig = ({
  setDebateConfig,
  setStartDebate,
}: DebateConfigProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn } = useSupabase();
  const { setLoadingDebate, setDebate } = useDebate();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useUserId();
  const [stepIdx, setStepIdx] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => null;
  const showErrorToast = (field: string) =>
    toast({
      title: "Missing Required Fields.",
      description: `${field} is a required field.`,
      status: "error",
      duration: 2000,
      isClosable: true,
    });

  const topic = watch("topic");
  const persona = watch("persona");
  const [geniusMode, setGeniusMode] = useState(false);

  useEffect(() => {
    const localStoreGeniusMode =
      localStorage.getItem("geniusMode") &&
      JSON.parse(localStorage.getItem("geniusMode") as string);

    if (localStoreGeniusMode) {
      const parsed = JSON.parse(localStoreGeniusMode);
      setValue("geniusMode", parsed);
    }
  }, []);

  useEffect(() => {
    /**
     * Check if the user has genius mode subscription (sub).
     * If sub then set mode
     * Else prompt modal to go upgrade
     */

    localStorage.setItem("geniusMode", JSON.stringify(geniusMode));
    setDebateConfig({ topic, persona, geniusMode });
  }, [geniusMode]);

  useEffect(() => {
    if (stepIdx === 0) {
      const topicInput = document.querySelector('input[name="topic"]');
      (topicInput as HTMLInputElement)?.focus();
    } else if (stepIdx === 1) {
      const personaInput = document.querySelector('input[name="persona"]');
      (personaInput as HTMLInputElement)?.focus();
    }
  }, [stepIdx]);

  const handleDebateSetup = async () => {
    if (!persona) {
      showErrorToast("Persona");
      return;
    }
    setLoadingDebate(true);
    try {
      if (!isOpen && !isLoggedIn) {
        onOpen();
        return;
      } else {
        onClose();
        setDebateConfig({ topic, persona, geniusMode });
        await axios
          .post("https://debateai.jawn.workers.dev/v1/debate", {
            topic,
            persona,
            model: geniusMode ? "gpt-4" : null,
            userId,
          })
          .then((res) => {
            const searchParams = new URLSearchParams(location.search);
            searchParams.set("debate", res.data.id);
            setDebate(res.data);
            navigate({
              ...location,
              search: searchParams.toString(),
            });
          });

        setStartDebate(true);
      }
    } finally {
      setLoadingDebate(false);
    }
  };

  const handleRandomize = (key: "topic" | "persona") => {
    if (key === "topic") {
      const randomTopic = getRandomTopic();
      setValue("topic", randomTopic);
    } else if (key === "persona") {
      const randomPersona = getRandomPersona();
      setValue("persona", randomPersona);
    }
  };

  return (
    <Box w="100%" maxW="600px">
      <SignUpModal
        isOpen={isOpen}
        handleSignUp={() => navigate("/login")}
        handleMaybeLater={handleDebateSetup}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        {stepIdx === 0 && (
          <>
            <Text mb="20px">What is the topic of the debate?</Text>
            <Input
              maxW="85%"
              placeholder="Choose a topic - gun control, free will, is a hotdog a sandwich, etc."
              {...register("topic")}
            />
            <HStack mt="30px" gap="10px" justifyContent="center">
              <Button onClick={() => handleRandomize("topic")}>
                Randomize
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  if (!topic) {
                    showErrorToast("Topic");
                  } else {
                    setStepIdx(1);
                  }
                }}
              >
                Next
              </Button>
            </HStack>
          </>
        )}
        {stepIdx === 1 && (
          <>
            <Text display="flex" justifyContent="center" mb="20px">
              Who would you like to engage in a debate?
            </Text>
            <Input
              {...register("persona")}
              maxW="85%"
              placeholder="Select a persona - Elon Musk, Ben Shapiro, Genius Physicist, etc"
            />
            <HStack
              mt="30px"
              spacing="10px"
              justifyContent="center"
              wrap="wrap"
            >
              <Box>
                {/* Genius Mode{" "}
                <Switch colorScheme="red" {...register("geniusMode")} /> */}
                <UpgradeTierModal
                  geniusMode={geniusMode}
                  setGeniusMode={setGeniusMode}
                />
              </Box>

              <HStack spacing="10px" wrap="wrap">
                <Button onClick={() => handleRandomize("persona")}>
                  Randomize
                </Button>
                <Button type="submit" onClick={() => handleDebateSetup()}>
                  Let's Debate
                </Button>
              </HStack>
            </HStack>
          </>
        )}
      </form>
    </Box>
  );
};
