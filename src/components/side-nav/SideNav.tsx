import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  IconButton,
  ListItem,
  UnorderedList,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";

const SideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const goToHome = () => {
    window.location.href = "/";
  };

  const goToMyDebates = () => {
    window.location.href = "/my-debates";
  };

  return (
    <>
      <IconButton onClick={onOpen} aria-label="Navigation" icon={<FaBars />} />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Debate AI</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" gap={3}>
              <Button
                variant="ghost"
                onClick={goToHome}
                justifyContent="flex-start"
              >
                Debate
              </Button>
              <Button
                variant="ghost"
                onClick={goToMyDebates}
                justifyContent="flex-start"
              >
                My Debates
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideNav;
