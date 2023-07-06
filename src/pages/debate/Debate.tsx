import { useState, useEffect } from "react";
import { Heading, VStack, Text, Box, Link, useColorModeValue } from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Orb } from "../../Orb";
import { DebateConfig } from "../../components/debate-config";
import { DebateConversation } from "../../components/debate-conversation";

export const Debate = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [debateConfig, setDebateConfig] = useState();

  useEffect(() => {
    if (debateConfig) {
      setStepIdx(1);
    }
  }, [debateConfig]);

  const linkColor = useColorModeValue("blue.500", "red.500");

  return (
    <>
      {stepIdx === 0 && (
        <VStack justifyContent="center" gap="50px">
          <VStack gap="10px">
            <Heading mb="0px" as="h1" fontWeight="500" fontSize="4xl">
              Welcome to DebateAI.org.
              <br />
              Are you ready for the challenge?
            </Heading>
            <Text fontSize="xl" fontWeight="500">
              Check out our{" "}
              <Link color={linkColor} target="_blank" rel="noopener noreferrer" href="https://discord.gg/tUhW3m6k">
                discord here
              </Link>
            </Text>
          </VStack>
          <Orb />
          <DebateConfig setDebateConfig={setDebateConfig} />
        </VStack>
      )}
      {stepIdx === 1 && (
        <>
          <Box position="absolute" top="10px" left="10px">
            <IoMdArrowRoundBack cursor="pointer" size={30} onClick={() => setStepIdx(0)} />
          </Box>
          <VStack gap="20px">
            <DebateConversation debateConfig={debateConfig} />
          </VStack>
        </>
      )}
    </>
  );
};
