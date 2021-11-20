import { useEffect, useState } from "react/cjs/react.development";
import Layout from "../../components/Layout/Layout";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import "./Video.css";

const url = process.env.REACT_APP_BACKEND_URL;

const Video = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetch(`${url}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const temp = data.videos.filter(
            (item) => item.category === "highlights"
          );
          setVideos(temp);
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="loader-container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="single-video-container">
          <div className="iframe-container">
            <iframe
              // width="560"
              // height="315"
              src="https://www.youtube.com/embed/sfJiR2sn3mg"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              className="video-iframe"
            ></iframe>
            <h2>4th Test | India Tour Of England 2021 | Full </h2>
            <p>
              <span>by </span>Sony Sports India
            </p>
            <h4>
              A remarkable match in The Oval ended with a great win for India,
              winning the fourth Test match by 157 runs. A remarkable match in
              The Oval ended with a great win for India, winning the fourth Test
              match by 157 runs. A remarkable match in The Oval ended with a
              great win for India, winning the fourth Test match by 157 runs. A
              remarkable match in The Oval ended with a great win for India,
              winning the fourth Test match by 157 runs. A remarkable match in
              The Oval ended with a great win for India, winning the fourth Test
              match by 157 runs.
            </h4>
          </div>
          <div className="other-videos-container">
            <h2>Similar Videos</h2>
            {videos.map((item) => (
              <div
                className="video-card"
                key={item._id}
                style={{ marginBottom: "1rem" }}
              >
                <img src={getImgUrl(item.url)} alt="" />
                <div className="video-description">
                  <h1 title={item.title}>{item.title}</h1>
                  <h3 title={item.channel}>{item.channel}</h3>
                </div>
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
        </div>
      )}
    </Layout>
  );
};

export default Video;
