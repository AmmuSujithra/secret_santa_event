import Image from "../assets/img/santa.webp";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/santa");
  };

  return (
    <div className="container">
      <h1>Welcome to Secret Santa</h1>
      <h2>It's time to play</h2>
      <img src={Image} alt="Santa" className="img" />
      <p>Click on the button to discover your secret santa</p>
      <div>
        <button
          type="button"
          className="btn btn-primary mt-2"
          onClick={handleClick}
        >
          Let's Play
        </button>
      </div>
    </div>
  );
};

export default Home;
