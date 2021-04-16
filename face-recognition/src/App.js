import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
// Import custom components
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

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
      value: 20,
      density: {
        enable: true,
        value_area: 200,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      boxesArr: [],
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000")
      .then(response => response.json())
      .then(console.log);
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };
  calculateFaceLocation = data => {
    const clarifaiFacesArray = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    const clarifaiBoxes = clarifaiFacesArray.map(el => {
      let box = el.region_info.bounding_box;
      return {
        leftCol: box.left_col * width,
        topRow: box.top_row * height,
        rightCol: width - box.right_col * width,
        bottomRow: height - box.bottom_row * height,
      };
    });
    return clarifaiBoxes;
  };


  displayFaceBoxes = boxesArr => {
    this.setState({ boxesArr });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };
  onRouteChange = route => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  };

  render() {
    const { isSignedIn, imageUrl, route, user, boxesArr } = this.state;
    return (
      <div className="App">
        <Particles params={particlesOptions} className="particles" />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : route === "home" ? (
          <div>
            <Logo />
            <Rank userEntries={user.entries} userName={user.name} />
            <ImageLinkForm
              onButtonSubmit={this.onButtonSubmit}
              onInputChange={this.onInputChange}
            />
            <FaceRecognition
              boxesArr={boxesArr}
              imageUrl={imageUrl}
            />
          </div>
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
