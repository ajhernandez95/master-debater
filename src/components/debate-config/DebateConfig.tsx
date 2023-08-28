import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

import { getRandomTopic, getRandomPersona } from "../../utils/debatConfig";
import { UpgradeTierModal } from "../upgradeTierModal";
import axios from "axios";
import useUserId from "../../hooks/useUserId";
import { useSupabase } from "../../context/SupabaseContext";

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
  const location = useLocation();
  const navigate = useNavigate();

  const { session } = useSupabase();
  const userId = useUserId();
  const [stepIdx, setStepIdx] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

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
    console.log(geniusMode);
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
  /**
   * curl --request POST \
  --url https://debateai.jawn.workers.dev/v1/debate \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: Insomnia/2023.5.5' \
  --data '{
    "topic": "Communism or socialism",
    "persona": "Elon Musk",
    "model": "gpt-4",
    "userId": "3bae1858-c845-4ce0-a359-ad0e8b723ce9",
    "heh": true
}'
   */

  const handleDebateSetup = async () => {
    setDebateConfig({ topic, persona, geniusMode });
    await axios
      .post("https://debateai.jawn.workers.dev/v1/debate", {
        topic,
        persona,
        model: geniusMode ? "gpt-4" : "gpt-3.5-turbo",
        userId,
      })
      .then((res) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("debate", res.data.id);
        navigate({
          ...location,
          search: searchParams.toString(),
        });
      });
    setStartDebate(true);
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
              <Button type="submit" onClick={() => setStepIdx(1)}>
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
