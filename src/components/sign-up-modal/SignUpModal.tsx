import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";

const SignUpModal = ({
  isOpen,
  handleMaybeLater,
  handleSignUp,
}: {
  isOpen: boolean;
  handleMaybeLater: () => void;
  handleSignUp: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={handleMaybeLater}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>DebateAI</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textAlign="center">
            {" "}
            🎉 Unlock a World of Intellectual Engagement! 🎉
          </Text>
          <Flex mt="10px" direction="column" gap="10px">
            <Text>
              🆓 Get a FREE trial to explore all our premium features. No
              commitments!
            </Text>
            <Text>
              💾 Save Debates: Never lose track of an intriguing argument. Save
              your debates and resume them later! Ready to elevate your debating
              skills?
            </Text>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleMaybeLater}>
            Maybe Later
          </Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
