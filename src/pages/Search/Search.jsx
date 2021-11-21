import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import { GoSearch } from "react-icons/go";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import "./Search.css";

const url = process.env.REACT_APP_BACKEND_URL;

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
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
      setLoading(true);
      const res = await fetch(`${url}/search?query=${query}`);
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setVideos(data.results);
      } else {
        showToast("Failed to fetch search results");
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
              <div className="video-card" key={item._id}>
                <img
                  src={getImgUrl(item.url)}
                  alt=""
                  onClick={() =>
                    navigate(`/video/${item._id}`, {
                      state: { video: item },
                    })
                  }
                />
                <Link
                  to={`/video/${item._id}`}
                  state={{ video: item }}
                  className="video-description"
                >
                  <h1 title={item.title}>{item.title}</h1>
                  <h3 title={item.channel}>{item.channel}</h3>
                </Link>
                <div className="video-icons">
                  <div style={{ flexGrow: "1" }}></div>
                  <MdBookmarkBorder />
                  &nbsp;&nbsp;
                  <MdPlaylistAdd />
                  &nbsp;&nbsp;
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1
            style={{ color: "white", fontSize: "1.2rem", textAlign: "center" }}
          >
            No results found
          </h1>
        )}
      </div>
    </Layout>
  );
};

export default Search;
