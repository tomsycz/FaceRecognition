import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import face from "./face.png";

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="Tilt br2 shadow-2"
        tiltReverse={false}
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glarePosition="all"
        scale={1.1}
        trackOnWindow={false}
        glareBorderRadius="5px"
      >
        <div className="inner-element pa3">
          <img style={{ paddingTop: "5px" }} src={face} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};
export default Logo;
