import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./lib/contextLib";
import { onError } from "./lib/errorLib";
import Routes from "./Routes";
import "./App.css";
import ParticlesBg from 'particles-bg';

function App() {
  const nav = useNavigate();
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

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);

    nav("/login");
  }

  return (
    !isAuthenticating && (
      // <div className="banner-text">
      //   <Navbar collapseOnSelect bg="light" expand="md" className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top">
      //     <LinkContainer to="/">
      //       <Navbar.Brand className="font-weight-bold">
      //         {' '}
      //         <img
      //             src="./ridgeline-icon.svg"
      //             width="30"
      //             height="30"
      //             className="d-inline-block align-top"
      //         />{' '}
      //         Rate My Ridgies
      //       </Navbar.Brand>ß
      //     </LinkContainer>

      //     <Navbar.Toggle />
      //     <Navbar.Collapse className="justify-content-end">
      //       <Nav activeKey={window.location.pathname}>
      //         {isAuthenticated ? (
      //           <>
      //             <LinkContainer to="/">
      //               <Nav.Link>Home</Nav.Link>
      //             </LinkContainer>
      //             <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
      //           </>
      //         ) : (
      //           <>
      //             <LinkContainer to="/signup">
      //               <Nav.Link>Signup</Nav.Link>
      //             </LinkContainer>
      //             <LinkContainer to="/login">
      //               <Nav.Link>Login</Nav.Link>
      //             </LinkContainer>
      //           </>
      //         )}
      //       </Nav>
      //     </Navbar.Collapse>
      //   </Navbar>
      <div className="banner-text">
        <ErrorBoundary>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
  
}

export default App;
