import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxesArr }) => {
  return (
    <div className="center ma">
      <div className="absolute mt4">
        <img
          id="inputimage"
          src={imageUrl}
          alt=""
          width="500px"
          height="auto"
        />
        {boxesArr.map((el, i) => {
          return (
            <div
              key={i}
              className="bounding-box"
              style={{
                top: `${el.topRow}px`,
                right: `${el.rightCol}px`,
                bottom: `${el.bottomRow}px`,
                left: `${el.leftCol}px`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
