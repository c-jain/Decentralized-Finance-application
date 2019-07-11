import React from "react";
import { Route, Link } from 'react-router-dom';
import { DrizzleContext } from "drizzle-react";

import Home from "./Components/Home";
import Create from "./Components/Create";
import List from "./Components/List";


export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create">Create</Link>
              </li>
              <li>
                <Link to="/list">List</Link>
              </li>
            </ul>

            <Route 
              exact
              path="/"
              render={
                props => (
                  <Home 
                    {...props}
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                  />
                )
              }
            />

            <Route 
              path="/create"
              render={
                props => (
                  <Create 
                    {...props}
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                  />
                )
              }
            />

            <Route 
              path="/list"
              render={
                props => (
                  <List 
                    {...props}
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                  />
                )
              }
            />
            
        </div>
      );
    }}
  </DrizzleContext.Consumer>
);
