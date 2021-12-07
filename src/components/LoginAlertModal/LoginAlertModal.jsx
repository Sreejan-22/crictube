import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  HStack,
} from "@chakra-ui/react";

const LoginAlertModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login required</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            You need to be logged in to be able to add video to this playlist
            <HStack>
              <Button colorScheme="blue" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button colorScheme="blue" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </HStack>
          </Stack>
          <br />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginAlertModal;
