import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, withRouter } from 'react-router-dom';
import { Drizzle } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

import options from './drizzleOptions';
import drizzleStore from './middleware/index'

import './index.css';
import 'react-toastify/dist/ReactToastify.css'
import App from './Components/App';
import * as serviceWorker from './serviceWorker';

const drizzle = new Drizzle(options, drizzleStore);

const Main = withRouter(props => ((
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <div>
            <ToastContainer />
            <App 
              drizzle={drizzle}
              drizzleState={drizzleState}
              {...props}
            />            
        </div>
      );
    }}
  </DrizzleContext.Consumer>
)));

ReactDOM.render(
      <DrizzleContext.Provider drizzle={drizzle}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>    
      </DrizzleContext.Provider>
      ,document.getElementById('root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
