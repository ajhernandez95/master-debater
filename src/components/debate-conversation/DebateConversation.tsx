import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { VStack, Grid, GridItem, Text, Textarea, Button, Box } from "@chakra-ui/react";
import { Orb } from "../../Orb";
import Loader from "../../animations/Loader";

interface DebateConversationProps {
  debateConfig: any;
}

type Inputs = {
  currMsg: string;
};

export const DebateConversation = ({ debateConfig }: DebateConversationProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const currMsg = watch("currMsg");

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.metaKey) {
      e.preventDefault(); // This prevents the default behavior of the enter key (new line)
      handleDebateMessage();
    }
    // When both the cmd key and the enter key are pressed
    else if (e.metaKey && e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior
      const cursorPosition = e.currentTarget.selectionStart; // Get the current cursor position
      const currentValue = e.currentTarget.value; // Get the current value of the textarea
      // Insert a newline character at the cursor position
      const newValue = currentValue.slice(0, cursorPosition) + "\n" + currentValue.slice(cursorPosition);
      setValue("currMsg", newValue);
    }
  };

  const handleDebateMessage = async () => {
    try {
      const currMessages = [...messages, { role: "user", content: currMsg }];
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: currMsg },
        {
          role: "assistant",
          content: (
            <Box w={["25px", "50px"]}>
              <Loader />
            </Box>
          ),
        },
      ]);
      setValue("currMsg", "");
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

          setMessages((prevMessages) => {
            prevMessages[prevMessages.length - 1].content = string;
            return [...prevMessages];
          });

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
    <>
      <VStack fontSize="16px" maxH="100vh" height="100%" justifyContent="space-between">
        <Box minH="80vh" maxH="80vh" overflowY="auto" ref={boxRef}>
          <Grid pt="10px" mb="10px" w="80vw" templateRows="repeat(auto-fill, auto)" gap={4}>
            {messages.map((message) => {
              return (
                <GridItem
                  justifySelf={message.role === "assistant" ? "flex-start" : "flex-end"}
                  key={message.content}
                  w="auto"
                  maxW="80%"
                  p="10px"
                  borderRadius="10px"
                  textAlign="start"
                  bg={message.role === "assistant" ? "gray.200" : "gray.800"}
                  color={message.role === "assistant" ? "gray.800" : "gray.100"}
                >
                  <Text>{message.content}</Text>
                </GridItem>
              );
            })}
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
            mb="10px"
            placeholder="Type your response here"
            onKeyDown={handleKeyDown}
            {...register("currMsg")}
          />
          <Button mb="10px" alignSelf="flex-end" onClick={() => handleDebateMessage()}>
            Send
          </Button>
        </form>
      </VStack>
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -70%)" zIndex={-1}>
        <Orb />
      </Box>
    </>
  );
};
