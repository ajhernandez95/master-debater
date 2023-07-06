import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { VStack, Grid, GridItem, Text, Textarea, Button, Box, HStack, Heading } from "@chakra-ui/react";
import { Orb } from "../../Orb";
import Loader from "../../animations/Loader";
import { v4 as uuidv4 } from "uuid";
import useUserId from "../../hooks/useUserId";
import ReactMarkdown from "react-markdown";

interface DebateConversationProps {
  debateConfig: any;
}

type Inputs = {
  currMsg: string;
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const DebateConversation = ({ debateConfig }: DebateConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [debateStarted, setDebateStarted] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const currMsg = watch("currMsg");
  const debateId = uuidv4();
  const userId = useUserId();

  useEffect(() => {
    document.getElementById("debate-textarea")?.focus();
  }, []);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.metaKey) {
        setValue("currMsg", e.currentTarget.value + "\n");
      } else if (!isSending) {
        debateUser(currMsg);
      }
    }
  };

  const startDebate = async () => {
    await debateUser(`${debateConfig.persona}, you start the debate about ${debateConfig.topic}!`);
    setDebateStarted(true);
  };

  async function debateUser(userMessage: string) {
    if (isSending) return;
    setIsSending(true);
    setDebateStarted(true);
    setValue("currMsg", "");

    const currMessages: Message[] = [...messages, { role: "user", content: userMessage }];

    setMessages((prevMessages: any) => [
      ...prevMessages,
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content: (
          <Box w={["25px", "50px"]}>
            <Loader />
          </Box>
        ),
      },
    ]);

    const streamCallBack = async (chunk: string) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = chunk;
        return newMessages;
      });
    };

    const completedCallBack = async (chunk: string) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = chunk;
        return newMessages;
      });
    };

    await streamAIResponse(currMessages, false, streamCallBack, completedCallBack);

    setIsSending(false);
  }

  async function debateAI() {
    if (isSending) return;
    setIsSending(true);
    setDebateStarted(true);

    const reversedRoleMessages: Message[] = messages.map((message) => {
      return {
        ...message,
        role: message.role === "user" ? "assistant" : "user",
      };
    });

    setMessages((prevMessages: any) => [
      ...prevMessages,
      {
        role: "user",
        content: (
          <Box w={["25px", "50px"]}>
            <Loader />
          </Box>
        ),
      },
    ]);

    const streamCallBack = async (chunk: string) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = chunk;
        return newMessages;
      });
    };

    const completedCallBack = async (chunk: string) => {
      let responseForHuman = "";

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = chunk;
        responseForHuman += chunk;
        return newMessages;
      });

      setTimeout(async () => {
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            role: "assistant",
            content: (
              <Box w={["25px", "50px"]}>
                <Loader />
              </Box>
            ),
          },
        ]);

        const updatedMessages = messages.concat([{ role: "user", content: responseForHuman }]);

        const streamCallBack = async (chunk: string) => {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].content = chunk;
            return newMessages;
          });
        };

        const completedCallBack = async (chunk: string) => {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].content = chunk;
            return newMessages;
          });
        };

        await streamAIResponse(updatedMessages, false, streamCallBack, completedCallBack);
        setIsSending(false);
      }, 2000);
    };

    await streamAIResponse(reversedRoleMessages, true, streamCallBack, completedCallBack);
  }

  async function streamAIResponse(
    debateMessages: Message[],
    isReversed: boolean,
    streamCallBack: (chunk: string) => Promise<void>,
    completedCallBack: (chunk: string) => Promise<void>
  ) {
    try {
      const response = await fetch("https://master-debater.jawn.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: debateConfig.topic,
          persona: debateConfig.persona,
          debate: debateMessages,
          isReversed: isReversed,
          userId: userId,
          debateId: debateId,
        }),
      });

      if (!response.body) {
        console.log("No response body to stream from");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let string = "";

      const batchDelayMs = 0;
      let result = await reader.read();

      while (!result.done) {
        string += decoder.decode(result.value, { stream: true });
        await streamCallBack(string);
        await sleep(batchDelayMs);
        result = await reader.read();
      }

      string += decoder.decode();
      await completedCallBack(string);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const truncateTopic = (topic: string) => {
    return topic.length > 30 ? topic.substring(0, 30) + "..." : topic;
  };

  return (
    <>
      <VStack fontSize="16px" maxH="100vh" height="100%" justifyContent="space-between">
        <Heading mt="10px">
          Debating {truncateTopic(debateConfig.topic)} with {truncateTopic(debateConfig.persona)}
        </Heading>
        <Box minH="70vh" maxH="80vh" overflowY="auto" ref={boxRef}>
          {!debateStarted && (
            <Button mt="10px" onClick={startDebate}>
              Let AI Start The Debate
            </Button>
          )}
          <Grid pt="10px" mb="10px" w="80vw" templateRows="repeat(auto-fill, auto)" gap={4}>
            {messages.map((message, index) => {
              return (
                <GridItem
                  justifySelf={message.role === "assistant" ? "flex-start" : "flex-end"}
                  key={index}
                  w="auto"
                  maxW="80%"
                  p="10px"
                  borderRadius="10px"
                  textAlign="start"
                  bg={message.role === "assistant" ? "gray.200" : "gray.800"}
                  color={message.role === "assistant" ? "gray.800" : "gray.100"}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </GridItem>
              );
            })}
            {!isSending && debateStarted && (
              <GridItem
                justifySelf="flex-end"
                w="auto"
                maxW="80%"
                p="10px"
                borderRadius="10px"
                textAlign="right"
                bg="gray.800"
                color="gray.100"
              >
                <Button onClick={debateAI}>Let AI Respond For You OR Respond Below</Button>
              </GridItem>
            )}
          </Grid>
        </Box>
        <form
          style={{
            width: "100%",
            maxWidth: "80vw",
            height: "20vh",
            maxHeight: "20vh",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Textarea
            id="debate-textarea"
            mb="10px"
            placeholder="Type your response here"
            onKeyDown={handleKeyDown}
            {...register("currMsg")}
          />
          <HStack justifyContent="center">
            <Button mb="10px" alignSelf="flex-end" onClick={() => debateUser(currMsg)} isDisabled={isSending}>
              Send
            </Button>
          </HStack>
        </form>
      </VStack>
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -70%)" zIndex={-1}>
        <Orb />
      </Box>
    </>
  );
};
