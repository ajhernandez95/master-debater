import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { getRandomTopic, getRandomPersona } from "../../utils/debatConfig";

interface DebateConfigProps {
  setDebateConfig: (debateConfig: any) => void;
}

type Inputs = {
  topic: string;
  persona: string;
};

export const DebateConfig = ({ setDebateConfig }: DebateConfigProps) => {
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

  useEffect(() => {
    if (stepIdx === 0) {
      const topicInput = document.querySelector('input[name="topic"]');
      (topicInput as HTMLInputElement)?.focus();
    } else if (stepIdx === 1) {
      const personaInput = document.querySelector('input[name="persona"]');
      (personaInput as HTMLInputElement)?.focus();
    }
  }, [stepIdx]);

  useEffect(() => {
    if (stepIdx === 1) {
      const personaInput = document.querySelector('input[name="persona"]');
      (personaInput as HTMLInputElement)?.focus();
    }
  }, [stepIdx]);

  const handleDebateSetup = () => {
    setDebateConfig({ topic, persona });
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
              <Button onClick={() => handleRandomize("topic")}>Randomize</Button>
              <Button type="submit" onClick={() => setStepIdx(1)}>
                Next
              </Button>
            </HStack>
          </>
        )}
        {stepIdx === 1 && (
          <>
            <Text m="auto" mb="20px">
              Who would you like to engage in a debate?
            </Text>
            <Input
              {...register("persona")}
              maxW="85%"
              placeholder="Select a persona - Elon Musk, Ben Shapiro, Genius Physicist, etc"
            />
            <HStack mt="30px" gap="10px" justifyContent="center">
              <Button onClick={() => handleRandomize("persona")}>Randomize</Button>
              <Button type="submit" onClick={() => handleDebateSetup()}>
                Let's Debate
              </Button>
            </HStack>
          </>
        )}
      </form>
    </Box>
  );
};
