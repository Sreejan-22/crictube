import Layout from "../../components/Layout/Layout";
import { useParams } from "react-router-dom";
import "./Playlist.css";

const Playlist = () => {
  const { playlist } = useParams();
  console.log(playlist);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Playlist;
