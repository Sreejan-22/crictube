import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import { GoSearch } from "react-icons/go";
import "./Search.css";
import { isAuthenticated, getUser } from "../../utils/auth";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchquery, setSearchquery] = useState("");
  const toast = useToast();

  const showToast = (title) => {
    toast({
      title,
      status: "error",
      duration: 4000,
      position: "top-right",
      isClosable: true,
    });
  };

  const search = async (query) => {
    try {
      const url = isAuthenticated()
        ? `${main_url}/searchuservideos?query=${query}`
        : `${main_url}/search?query=${query}`;

      const headers = isAuthenticated()
        ? {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          }
        : {};

      setLoading(true);
      const res = await fetch(url, { headers: headers });
      const data = await res.json();
      if (data.success) {
        const temp = isAuthenticated() ? data.results.allVideos : data.videos;
        console.log(data);
        setVideos(temp);
        setLoading(false);
      } else {
        setLoading(false);
        showToast(data.message);
      }
    } catch (err) {
      setLoading(false);
      showToast("Failed to fetch search results");
    }
  };

  return (
    <Layout>
      <div className="search-container">
        <div className="search-section">
          <div className="search-wrapper">
            <InputGroup size="md">
              <Input
                placeholder="Search"
                color="white"
                focusBorderColor="none"
                onChange={(e) => setSearchquery(e.target.value)}
              />
              <InputRightAddon
                children={<GoSearch />}
                cursor="pointer"
                onClick={() => {
                  if (searchquery.length) {
                    search(searchquery);
                  }
                }}
              />
            </InputGroup>
          </div>
        </div>
        <br />
        <br />
        {/* <div className="searched-videos"></div> */}
        {loading ? (
          <h1
            style={{ color: "white", fontSize: "1.2rem", textAlign: "center" }}
          >
            Loading search results...
          </h1>
        ) : videos.length ? (
          <div className="video-container">
            {videos.map((item) => (
              <VideoCard
                item={isAuthenticated() ? item.videoId : item}
                playlists={playlists}
                // setPlaylists={setPlaylists}
                playlistsIncluded={isAuthenticated() ? item.playlists : []}
                key={item._id}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Search;
