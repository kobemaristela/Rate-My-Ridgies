import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Auth, API, Storage } from "aws-amplify";
import { useParams, useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../lib/errorLib";
import { useAppContext } from "../lib/contextLib";
import { s3Upload } from "../lib/awsLib";
import config from "../config";
import "./Reviews.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ParticlesBg from 'particles-bg';
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';

export default function Reviews() {
  const file = useRef(null);
  const { id } = useParams();
  const nav = useNavigate();
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  const [note, setNote] = useState(null);
  // const id = useParams();
  const [reviewBody, setReviewBody] = useState("");
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  let DATESTRING_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric',  };
  const BUCKETURL = "https://dev-rmr-storagestack-photosbucket4131342a-1hl6bc03sa6kc.s3.us-west-2.amazonaws.com/"
  const DEFAULTPROFILEURL = "https://dev-rmr-storagestack-photosbucket4131342a-1hl6bc03sa6kc.s3.us-west-2.amazonaws.com/default.svg"

  useEffect(() => {
    function loadNote() {
      return API.get("reviews", `/reviews`);
    }

    function loadProfile() {
      return API.get("profiles", `/profiles/${id}`);
    }

    async function onLoad() {
      try {
        let reviews = await loadNote();
        let filteredReviews = reviews.filter((r) => { return r.revieweeProfileId === id })
        setReviews(filteredReviews)

        const prof = await loadProfile();
        
        setProfile(prof);
        // const { content, attachment } = note;
        // if (attachment) {
        //   note.attachmentURL = await Storage.vault.get(attachment);
        // }
        // setContent(content);
        // setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id, reviews]);

  function validateForm() {
    return reviewBody.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveReview(note) {
    return API.post("reviews", `/reviews`, {
      body: note,
    });
  }

  function refreshPage() {
    window.location.reload(false);
  }

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();
    setIsLoading(true);

    try {
      
      await saveReview({
        revieweeProfileId: id,
        reviewBody : reviewBody,
        revieweeName : profile.revieweeName
      });
      nav(`/`);
      // refreshPage();
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      nav("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  const deleteReview = (revId) => {
    console.log("deleting");
    return API.del("reviews", `/reviews/${revId}`);
    
  }

  const renderReviews = () => {
    return reviews.length !== 0 ? reviews.map(({ reviewId, revieweeProfileId, reviewBody, createdAt}, index) =>{

      return (
        <div class="col-6"> 
        <div class="toast fade show ">
          <div class="toast-header">
            <strong class="me-auto"><i class="bi-globe"></i> Review {index + 1}</strong>
            <small> {new Date(createdAt).toLocaleString('en-US', DATESTRING_OPTIONS)}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" onClick={() => deleteReview(reviewId)}></button>
            {/* <button type="button" class="btn-edit" data-bs-dismiss="toast" onClick={() => deleteReview(reviewId)}></button> */}
            {/* <button style='font-size:24px'>Button <i class='far fa-edit'></i></button> */}
          </div>
          <div class="toast-body ">
            {reviewBody}
          </div>
        </div>
      </div>
    )})
  

      :

      <div className="review-preview">No Reviews Yet </div>
  };

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);

    nav("/");
  }

 

  return (
    
    <>
    <ParticlesBg type="cobweb" bg={true} />

    <div className="banner-text">
          <Navbar collapseOnSelect bg="light" expand="lg" className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top">
            <LinkContainer to="/">
              <Navbar.Brand className="font-weight-bold">
                {' '}
                <img
                  src="/ridgeline-icon.svg"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="ridgeline-icon"
                />{' '}
              Review the Ridgies
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
    
      <div className="Profile">
      
      <div>

          <div className="flexbox-container-rv flex-items">

            {/* <div className="flex-items profile-image">{matchProfileIdWithPhoto(profile.profileId)}</div> */}
            <div className="flex-items profile-image">
              <img
                className="profile-image" alt="headshot"
                fake={console.log(BUCKETURL + profile.profileId + ".png")}
                src={BUCKETURL + profile.profileId + ".jpg"}
                onError={(e) => {
                  const rndInt = randomIntFromInterval(1, 10)
                  e.target.src = BUCKETURL + "default" + rndInt + ".svg" //replacement image imported above

                  // e.target.style = 'padding: 8px; margin: 16px' // inline styles in html format
                }}></img>

            </div>
            <div className="flex-items" >
              {/* {content.trim().split("\n")[0]}
                        */}
              <p className="profile-name">
                {profile.profileName}
              </p>
              
              <p className="profile-role">
              Role: {profile.profileRole}
              </p>

              <p className="member-since">
                Member Since: {new Date(profile.createdAt).toLocaleString('en-US', DATESTRING_OPTIONS)}
              </p>

            </div>


            
          </div>
          <div class="container-fluid">
              <div className="row" >

                {/* <div class="m-4 container-right "> */}
                    {/* <div class="toast-container box row">
                    </div> */}


                {/* </div> */}
                  {/* <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
                  <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
                  
                  <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
                <div class="col-6 col-sm-3">.col-6 .col-sm-3</div> */}

                {renderReviews()}
                  
                </div>
              </div>  

        </div>
      
      <br></br>
      <br></br>
      <br></br>
      <h2>Create a new review for {profile.profileName}</h2>
                  
      <div className="Notes">

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
            />
          </Form.Group>
          {/* <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group> */}
          <LoaderButton
            block="true"
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
        </Form>
      </div>
            

    </div>
    </>
    
  );
}

