import { useState } from "react";
import { useSelector } from "react-redux";
import { videoSelector } from "../../slices/video.slice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { isAuthenticated } from "../../utils/auth";
import { isIncludedInArray } from "../../utils/isIncludedInArray";

const AddToPlaylistModal = ({
  isOpen,
  onClose,
  video,
  addToOrRemoveFromPlaylist,
  createNewPlaylist,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { playlists, newPlaylistLoading, addPlaylistLoading } =
    useSelector(videoSelector);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add to playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            {isAuthenticated()
              ? playlists
                  .filter((playlist) => playlist.name !== "Saved")
                  .map((playlist) => (
                    <Checkbox
                      key={playlist._id}
                      isChecked={isIncludedInArray(playlist.videos, video._id)}
                      isDisabled={addPlaylistLoading}
                      onChange={(e) => {
                        e.preventDefault();
                        addToOrRemoveFromPlaylist(e, playlist._id);
                      }}
                    >
                      {playlist.name}
                    </Checkbox>
                  ))
              : null}
            <br />
            {addPlaylistLoading ? (
              <>
                <Spinner />
                <br />
              </>
            ) : null}
            <Input
              placeholder="Enter playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              isDisabled={newPlaylistLoading}
            />
            <Button
              colorScheme="blue"
              isLoading={newPlaylistLoading}
              onClick={() => {
                const name = newPlaylistName;
                if (!name.length) {
                  return;
                }
                setNewPlaylistName("");
                createNewPlaylist(name);
              }}
            >
              Create new playlist
            </Button>
          </Stack>
          <br />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddToPlaylistModal;
