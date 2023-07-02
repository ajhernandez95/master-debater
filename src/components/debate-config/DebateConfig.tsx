import { useState } from "react";
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
            <Text mb="20px">What is the topic of our debate?</Text>
            <Input
              maxW="80%"
              placeholder="You can choose any topic, be it
            climate change, artificial intelligence, space travel, or even if
            the sky is blue."
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
            <Text m="auto" mb="20px">
              Who would you like to engage in a debate?
            </Text>
            <Input
              maxW="80%"
              placeholder="Select any persona or
            individual, be it historical figures like Albert Einstein or Abraham
            Lincoln, fictional characters like Sherlock Holmes or Iron Man, or
            prominent personalities such as Elon Musk or Michelle Obama."
              {...register("persona")}
            />
            <HStack mt="30px" gap="10px" justifyContent="center">
              <Button onClick={() => handleRandomize("persona")}>
                Randomize
              </Button>
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
