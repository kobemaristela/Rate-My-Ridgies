import React, { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import "./Home.css";

export default function Home() {
  const [profiles, setprofiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  let DATESTRING_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const profiles = await loadProfiles();
        console.log(profiles)
        setprofiles(profiles);

        
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

  function renderProfilesList(profiles) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>

        {/* create the list of profiles */}
        {profiles.map(({ profileLikes, profileName, profileRole, profilePhoto,
        profileId, createdAt}) => (
          // <LinkContainer key={profileId} to={`/notes/${noteId}`}>
          // <LinkContainer key={profileId} >
            <ListGroup.Item action>
              <div class="flexbox-container">
                
                <div class="flex-items profile-image">Image Placeholder</div>
                <div class="flex-items" >
                    {/* {content.trim().split("\n")[0]}
                    */}
                  {profileName}
                  <br></br>
                  <p class="member-since">
                    Member Since: {new Date(createdAt).toLocaleString('en-US', DATESTRING_OPTIONS)}
                  </p>
                </div>

                <div class="flex-items">
                    Role: {profileRole}
                </div>
                
                <div class="num-likes">
                    Reviews: {profileLikes}
                </div>

                <div class="num-likes" >
                    Likes: {profileLikes}
                </div>
              </div>
            </ListGroup.Item>
          // </LinkContainer>

          // <div> This is a new profile</div>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Rate My Ridgies</h1>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">The Ridgies!</h2>
        <ListGroup>{!isLoading && renderProfilesList(profiles)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
