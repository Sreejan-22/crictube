import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  useDisclosure,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import "./VideoCard.css";

const VideoCard = ({ item, playlists, isAdded }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const saveVideo = (video) => {
    console.log(video);
    // setSaving(true)/
  };

  return (
    <div className="video-card">
      <img
        src={getImgUrl(item.url)}
        alt=""
        onClick={() =>
          navigate(`/video/${item._id}`, {
            state: { video: item, playlists },
          })
        }
      />
      <Link
        to={`/video/${item._id}`}
        state={{ video: item, playlists }}
        className="video-description"
      >
        <h1 title={item.title}>{item.title}</h1>
        <h3 title={item.channel}>{item.channel}</h3>
      </Link>
      <div className="video-icons">
        <div style={{ flexGrow: "1" }}></div>
        {saving ? (
          <Spinner />
        ) : (
          <MdBookmarkBorder onClick={() => saveVideo(item)} />
        )}
        &nbsp;&nbsp;
        <MdPlaylistAdd onClick={onOpen} />
        &nbsp;&nbsp;
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add to playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              {playlists.map((playlist, index) => (
                <Checkbox key={playlist._id} isChecked={isAdded[index]}>
                  {playlist.name}
                </Checkbox>
              ))}
              <br />
              <Input placeholder="Enter playlist name" />
              <Button colorScheme="blue">Create new playlist</Button>
            </Stack>
            <br />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VideoCard;
