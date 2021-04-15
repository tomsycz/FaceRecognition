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
      box: {},
    };
  }
  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = box => {
    console.log(box);
    this.setState({ box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch(err => console.log(err));
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

        <FaceRecognition box={this.state.box} imageUrl={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
