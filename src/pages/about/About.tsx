import { Card, CardBody, Flex, Highlight, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { getDonateLink } from "../../utils/stripe";
import useStripe from "../../hooks/useStripe";
import { useSupabase } from "../../context/SupabaseContext";

const About = () => {
  const { isLoggedIn } = useSupabase();
  const { initiateStripePurchase } = useStripe();

  const handleUpgradeTier = () => {
    if (!isLoggedIn) {
      window.location.href = "/login?redirectToUpgrade=1";
    } else {
      initiateStripePurchase();
    }
  };
  return (
    <Card margin="20px 40px">
      <CardBody>
        <Flex
          direction="column"
          alignItems="center"
          gap="20px"
          textAlign="left"
        >
          <Text>
            At DebateAI.org, our mission is to foster a space where individuals
            can explore diverse ideas, challenge their beliefs, and gain fresh
            perspectives. We believe in empowering students with modern LLMs to
            engage in rational debates, moving away from the traditional rote
            memorization methods.
          </Text>
          <Text>
            Whether you're a debate enthusiast, a student, or someone passionate
            about meaningful conversations, we're here for you. To continue
            offering this platform without barriers, we need your support.
            Please consider{" "}
            <Link to={getDonateLink()}>
              <Highlight
                query="donating"
                styles={{ px: "2", py: "1px", rounded: "full", bg: "white" }}
              >
                donating
              </Highlight>
            </Link>{" "}
            to help us keep DebateAI.org free for everyone. Every contribution
            makes a difference!
          </Text>
          <Text>
            Additionally, if you're looking for an enhanced debating experience,
            consider{" "}
            <Text display="inline" cursor="pointer" onClick={handleUpgradeTier}>
              <Highlight
                query="subscribing to our Pro Plan"
                styles={{ px: "2", py: "1px", rounded: "full", bg: "white" }}
              >
                subscribing to our Pro Plan
              </Highlight>{" "}
            </Text>
            at $9.95/month. This not only supports our platform but also grants
            you access to the Genius Mode, ensuring top-tier debate quality.
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default About;
