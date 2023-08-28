import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
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
    console.log(user);
  }, [user]);
  return (
    <Box>
      {myDebates.map((debate, i) => (
        <Card key={i} m={2} mb={5}>
          <CardBody textAlign="left">
            <Text mb={2}>
              <b>Topic</b>: {debate.short_topic}
            </Text>
            <Text>
              <b>Persona</b>: {debate.persona}
            </Text>
          </CardBody>
          <CardFooter justifyContent="flex-end">
            <Button onClick={() => goToDebate(debate)}>View Debate</Button>
          </CardFooter>
        </Card>
      ))}
    </Box>
  );
};

export default MyDebates;
