import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useSupabase } from "../../context/SupabaseContext";

const MyDebates = () => {
  const { user, supabase } = useSupabase();
  const [myDebates, setMyDebates] = useState<any[]>([]);

  const getMyDebates = async () => {
    const res = await supabase
      .from("debates")
      .select("*")
      .eq("user_id", user?.id);

    if (res.data) setMyDebates(res.data);
  };

  const goToDebate = (debate: any) => {
    window.location.href = `/debate?debate=${debate.id}`;
  };

  useEffect(() => {
    if (user) getMyDebates();
  }, [user]);
  return (
    <Box>
      {myDebates?.length > 0 ? (
        myDebates.map((debate, i) => (
          <Card key={i} m={5} mb={5}>
            <CardBody textAlign="left">
              <Text mb={2}>
                <b>Topic</b>: {debate.short_topic}
              </Text>
              <Text>
                <b>Persona</b>: {debate.persona}
              </Text>
              <Text display="flex" alignItems="center">
                <b>Genius Mode</b>:{" "}
                <Box ml={1}>
                  {debate.model === "gpt-4" ? (
                    <AiFillCheckCircle />
                  ) : (
                    <AiFillCloseCircle />
                  )}
                </Box>
              </Text>
            </CardBody>
            <CardFooter justifyContent="flex-end">
              <Button onClick={() => goToDebate(debate)}>View Debate</Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Text>You have not created any debates yet.</Text>
      )}
    </Box>
  );
};

export default MyDebates;
