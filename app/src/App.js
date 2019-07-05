import React, { Component } from "react";
import { DrizzleContext } from "drizzle-react";
import { Drizzle } from "drizzle";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
// import MyContainer from "./MyContainer";
import MyComponent from "./MyComponent";

const drizzle = new Drizzle(drizzleOptions);

class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <MyComponent />
      </DrizzleContext.Provider>
    );
  }
}

export default App;
