import {
  VStack,
  Grid,
  GridItem,
  Text,
  Textarea,
  Button,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

interface DebateConversationProps {
  debateConfig: any;
}

export const DebateConversation = ({
  debateConfig,
}: DebateConversationProps) => {
  const [currMsg, setCurrMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleResponseChange = (event: any) => {
    setCurrMsg(event.target.value);
  };

  const handleDebateMessage = async () => {
    try {
      const currMessages = [...messages, { role: "user", content: currMsg }];
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: currMsg },
      ]);
      setCurrMsg("");
      const response = await fetch("https://master-debater.jawn.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: debateConfig.topic,
          persona: debateConfig.persona,
          debate: currMessages,
        }),
      });

      if (!response.body) {
        console.log("No response body to stream from");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let string = "";

      reader.read().then(function processStream({ done, value }): any {
        if (done) {
          // Decoding the remaining data after the stream is done
          string += decoder.decode();

          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "assistant", content: string },
          ]);

          console.log("Stream complete");
          return;
        }

        // Decoding in streaming mode
        string += decoder.decode(value, { stream: true });

        return reader.read().then(processStream);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <VStack maxH="100vh" height="100%" justifyContent="space-between">
      <Box minH="80%" maxH="100%" overflowY="auto" ref={boxRef}>
        <Grid
          pt="10px"
          mb="10px"
          w="80vw"
          templateRows="repeat(auto-fill, auto)"
          gap={4}
        >
          {messages.map((message) => {
            return (
              <GridItem
                justifySelf={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                key={message.content}
                w="auto"
                maxW="50%"
                p="20px"
                borderRadius="10px"
                textAlign="start"
                bg={message.role === "assistant" ? "gray.800" : "gray.100"}
                color={message.role === "assistant" ? "gray.100" : "gray.800"}
              >
                <Text>{message.content}</Text>
              </GridItem>
            );
          })}
        </Grid>
      </Box>
      <Textarea
        mb="10px"
        placeholder="Type your response here"
        value={currMsg}
        onChange={handleResponseChange}
      />
      <Button alignSelf="flex-end" onClick={() => handleDebateMessage()}>
        Send
      </Button>
    </VStack>
  );
};
