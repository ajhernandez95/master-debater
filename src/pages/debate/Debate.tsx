import { useState, useEffect } from "react";
import {
  Heading,
  VStack,
  Text,
  Link,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { Orb, Theme } from "../../Orb";
import { DebateConfig } from "../../components/debate-config";
import { DebateConversation } from "../../components/debate-conversation";
import useQueryParam from "../../hooks/useQueryParam";
import { useDebate } from "../../context/DebateContext";
import { useSupabase } from "../../context/SupabaseContext";
import { GiBrain } from "react-icons/gi";
import { getDonateLink } from "../../utils/stripe";
import { NavLink } from "react-router-dom";

export const Debate = () => {
  const { supabase } = useSupabase();
  const {
    debateStep,
    setDebateStep,
    setDebate,
    loadingDebate: loading,
  } = useDebate();
  const debateId = useQueryParam("debate");

  const [debateConfig, setDebateConfig] = useState({
    topic: "",
    persona: "",
    geniusMode: false,
  });
  const [startDebate, setStartDebate] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const [orbTheme, setOrbTheme] = useState("default");

  const getDebate = async () => {
    const debateRes = await supabase
      .from("debates")
      .select("*")
      .eq("id", debateId)
      .single();

    if (debateRes.data) {
      setDebate(debateRes.data);
      setDebateConfig({
        topic: debateRes.data.topic,
        persona: debateRes.data.persona,
        geniusMode: debateRes.data.model === "gpt-4",
      });
    }
    const messageRes = await supabase
      .from("turns")
      .select("*")
      .eq("debate_id", debateId);

    if (messageRes?.data?.length) {
      const messages = messageRes.data.map((message) => {
        return {
          content: message.content,
          role:
            message.speaker === "user" || message.speaker === "AI_for_user"
              ? "user"
              : "assistant",
          model: message.model,
        };
      });

      setMessages(messages);
    }
  };

  useEffect(() => {
    if (debateId) {
      getDebate();
      setDebateStep(1);
    }
  }, []);

  useEffect(() => {
    if (startDebate) {
      setDebateStep(1);
    }
  }, [startDebate]);

  useEffect(() => {
    const geniusMode = debateConfig.geniusMode;
    setOrbTheme(geniusMode ? "genius" : "default");
  }, [debateConfig]);

  const linkColor = useColorModeValue("blue.500", "red.500");

  return (
    <>
      {debateStep === 0 && (
        <VStack m="10px" justifyContent="center" gap="50px">
          <VStack gap="10px">
            <Heading mb="0px" as="h1" fontWeight="500" fontSize="4xl">
              Welcome to DebateAI.org.
              <br />
              Are you ready for the challenge?
            </Heading>
            <Text fontSize="xl" fontWeight="500">
              Check out our{" "}
              <Link
                color={linkColor}
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.gg/Rfhkphgtpj"
              >
                discord here
              </Link>
            </Text>
          </VStack>
          <Orb loading={loading} theme={orbTheme as Theme} />
          <DebateConfig
            setDebateConfig={setDebateConfig}
            setStartDebate={setStartDebate}
          />
          <NavLink to={getDonateLink()}>
            <Box
              display="flex"
              alignItems="center"
              position={["absolute", "fixed"]}
              gap="10px"
              bottom="10px"
              left="10px"
              cursor="pointer"
            >
              <GiBrain />
              <Text fontWeight="600"> Donate</Text>
            </Box>
          </NavLink>
        </VStack>
      )}
      {debateStep === 1 && (
        <VStack gap="20px">
          <DebateConversation
            startingMessages={messages}
            debateConfig={debateConfig}
          />
        </VStack>
      )}
    </>
  );
};
