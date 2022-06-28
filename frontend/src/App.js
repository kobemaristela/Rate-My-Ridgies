import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./lib/contextLib";
import { onError } from "./lib/errorLib";
import Routes from "./Routes";
import "./App.css";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <ErrorBoundary>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated }}
        >
          <Routes />
        </AppContext.Provider>
      </ErrorBoundary>
    )
  );
  
}

export default App;
