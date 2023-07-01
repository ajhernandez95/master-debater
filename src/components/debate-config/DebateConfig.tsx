import { useState } from "react";
import { Box, Button, HStack, Text, Textarea } from "@chakra-ui/react";

interface DebateConfigProps {
  setDebateConfig: (debateConfig: any) => void;
}

export const DebateConfig = ({ setDebateConfig }: DebateConfigProps) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [topic, setTopic] = useState("");
  const [persona, setPersona] = useState("");

  const handleTopicChange = (e: any) => {
    setTopic(e.target.value);
  };

  const handlePersonaChange = (e: any) => {
    setPersona(e.target.value);
  };

  const handleDebateSetup = () => {
    setDebateConfig({ topic, persona });
  };

  return (
    <Box w="100%" maxW="600px">
      {stepIdx === 0 && (
        <>
          <Text mb="20px">What is the topic of our debate?</Text>
          <Textarea
            value={topic}
            onChange={handleTopicChange}
            rows={4}
            placeholder="You can choose any topic, be it
            climate change, artificial intelligence, space travel, or even if
            the sky is blue."
          />
          <HStack mt="30px" gap="10px" justifyContent="center">
            <Button>Randomize</Button>
            <Button onClick={() => setStepIdx(1)}>Next</Button>
          </HStack>
        </>
      )}
      {stepIdx === 1 && (
        <>
          <Text m="auto" mb="20px">
            Who would you like to engage in a debate?
          </Text>
          <Textarea
            value={persona}
            onChange={handlePersonaChange}
            rows={4}
            placeholder="Select any persona or
            individual, be it historical figures like Albert Einstein or Abraham
            Lincoln, fictional characters like Sherlock Holmes or Iron Man, or
            prominent personalities such as Elon Musk or Michelle Obama."
          />
          <HStack mt="30px" gap="10px" justifyContent="center">
            <Button>Randomize</Button>
            <Button onClick={() => handleDebateSetup()}>Let's Debate</Button>
          </HStack>
        </>
      )}
    </Box>
  );
};
