import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
// Import custom components
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

// importing styling
import "./App.css";
// importing config file
import CONFIG from "./config";

const app = new Clarifai.App({
  apiKey: CONFIG.CLARIFI_API_KEY,
});

const particlesOptions = {
  particles: {
    number: {
      value: 10,
      density: {
        enable: true,
        value_area: 200,
      },
    },
  },
  interactivity: {
    onhover: {
      enable: true,
      mode: "grab",
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
    };
  }
  onInputChange = event => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function (response) {
        console.log(
          response.outputs[0].data.regions[0].region_info.bounding_box
        );
      },
      function (err) {
        //err
      }
    );
  };
  render() {
    return (
      <div className="App">
        <Particles params={particlesOptions} className="particles" />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onButtonSubmit={this.onButtonSubmit}
          onInputChange={this.onInputChange}
        />

        <FaceRecognition imageUrl={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
