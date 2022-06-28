import React, { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { Auth, API, Storage} from "aws-amplify";
import "./Home.css";
import BootstrapCarouselComponent from "../components/BootstrapCarousel";
import ParticlesBg from 'particles-bg';
import Fade from "react-reveal";
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";



export default function Home() {
  const nav = useNavigate();
  const [profiles, setprofiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  let DATESTRING_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const BUCKETURL = "https://dev-rmr-storagestack-photosbucket4131342a-1ik1ict6zmone.s3.us-west-2.amazonaws.com/private/us-west-2%3A84c264a5-fc9f-4988-adeb-0c97eb72beaf/"
  const DEFAULTPROFILEURL = "https://dev-rmr-storagestack-photosbucket4131342a-1ik1ict6zmone.s3.us-west-2.amazonaws.com/default.jpg"
  
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const profiles = await loadProfiles();
        console.log(profiles)
        setprofiles(profiles);

        const reviews = await loadReviews();
        console.log(reviews)
        setReviews(reviews);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadProfiles() {
    return API.get("profiles", "/profiles");
  }

  let loadReviews = () => {
    return API.get("reviews", "/reviews")
  }

  let matchReviewWithProfile = (profileId, r) => {
    const reviews = r.filter(
      ({ revieweeProfileId }) => {
        // console.log(`ProfileID: ${profileId}`, `revieweeProfileId: ${revieweeProfileId}`)
        return revieweeProfileId === profileId
      }
    ).splice(0, 3)
    
    console.log("reviews: ", reviews)
    return reviews.length !== 0 ? reviews.map(({ reviewId, revieweeProfileId, reviewBody }) =>
      (

      <div className="review-preview" key={reviewId}>{reviewBody.slice(0, 30) + "..."}</div>
      ))

      :

      <div className="review-preview">No Reviews Yet </div>

  };

  let matchProfileIdWithPhoto = (profileId) => {

    let photo = (async() => {
      const photo = await Storage.vault.get(profileId + ".png");
      console.log("photo: ", photo);
      return 
    })()

    console.log(photo)
    return (
      <div className="profile-image">
        <img 
            className="profile-image"alt="headshot" 
          fake={console.log(BUCKETURL + profileId + ".png")}
            src={BUCKETURL + profileId + ".png"}
          onError={(e) => {
            e.target.src = DEFAULTPROFILEURL//replacement image imported above
            // e.target.style = 'padding: 8px; margin: 16px' // inline styles in html format
          }}

          ></img>
      </div>
      )


  };
  
  function renderProfilesList(profiles, reviews) {
    return (
      <>
        <LinkContainer to="/profiles/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new profile</span>
          </ListGroup.Item>
        </LinkContainer>

        {/* create the list of profiles */}
        {profiles.map(({ profileLikes, profileName, profileRole, profilePhoto,
        profileId, createdAt}) => (
          <LinkContainer key={profileId} to={`/notes/${profileId}`}>
          
          <ListGroup.Item action key={profileId}>
              <div className="flexbox-container">
                
                <div className="flex-items profile-image">{matchProfileIdWithPhoto(profileId)}</div>
                {/* <div className="flex-items profile-image">place holder</div> */}
                <div className="flex-items" >
                    {/* {content.trim().split("\n")[0]}
                    */}
                  {profileName}
                  <br></br>
                  <p className="member-since">
                    Member Since: {new Date(createdAt).toLocaleString('en-US', DATESTRING_OPTIONS)}
                  </p>
                </div>

                <div className="flex-items">
                    Role: {profileRole}
                </div>
                
                <div className="review-preview-container">

                  <div className="review-preview">
                      {matchReviewWithProfile(profileId, reviews)}
                    
                  </div>
                </div>

              <div className="num-likes" >
                    Likes: {profileLikes}
                </div>
              </div>
            </ListGroup.Item>
          </LinkContainer>

          // <div> This is a new profile</div>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <header id="home">
        <div className="row banner">
          <div className="banner-text">
            <Fade bottom>
                  <h1 className="responsive-headline">Rate My Ridgies</h1>
                </Fade>
            <Fade bottom duration={1200}>
              <h3>A site where you can rate your ridgies.</h3>
            </Fade>
            <hr />
            <Fade bottom duration={2000}>
              <ul className="social">
              <Button block='true' href="/signup" variant="primary" size="lg" active>Signup</Button>
              <Button block='true' href="/login" variant="primary" size="lg" active>Login</Button>
              </ul>
            </Fade>    
          </div>
        </div>
        </header>
    );
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);

    nav("/");
  }



  function renderProfiles() {
    return (
      <>
      <div className="banner-text">
        <Navbar collapseOnSelect bg="light" expand="lg" className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold">
              {' '}
              <img
                  src="./ridgeline-icon.svg"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
              />{' '}
              Rate My Ridgies
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/">
                    <Nav.Link>Home</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Review The Ridgies</h2>
        <ListGroup>{!isLoading && renderProfilesList(profiles, reviews)}</ListGroup>
      </div>
      </>
    );
  }

  return (
    <div className="Home">
      <ParticlesBg type="circles" bg={true} />
      {isAuthenticated ? renderProfiles() : renderLander()}
    </div>
  );
}
