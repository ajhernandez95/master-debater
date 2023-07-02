import { useState, useEffect } from "react";
import { Heading, VStack, Text, Box } from "@chakra-ui/react";
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

  return (
    <>
      {stepIdx === 0 && (
        <VStack justifyContent="center" gap="50px">
          <Heading as="h1" fontWeight="500" fontSize="4xl">
            Can you defeat the Master Debater?
          </Heading>
          <Orb />
          <DebateConfig setDebateConfig={setDebateConfig} />
        </VStack>
      )}
      {stepIdx === 1 && (
        <>
          <Box position="absolute" top="10px" left="10px">
            <IoMdArrowRoundBack
              cursor="pointer"
              size={30}
              onClick={() => setStepIdx(0)}
            />
          </Box>
          <VStack gap="20px">
            <DebateConversation debateConfig={debateConfig} />
          </VStack>
        </>
      )}
    </>
  );
};
