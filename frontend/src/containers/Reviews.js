import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { API, Storage } from "aws-amplify";
import { useParams, useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../lib/errorLib";
import { s3Upload } from "../lib/awsLib";
import config from "../config";
import "./Reviews.css";

import ListGroup from "react-bootstrap/ListGroup";

export default function Reviews() {
  const file = useRef(null);
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  // const id = useParams();
  const [reviewBody, setReviewBody] = useState("");
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  let DATESTRING_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric',  };

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
  }, [id]);

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

  const renderReviews = () => {
    
    
    return reviews.length !== 0 ? reviews.map(({ reviewId, revieweeProfileId, reviewBody, createdAt}, index) =>
    (

      <div class="toast fade show">
        <div class="toast-header">
          <strong class="me-auto"><i class="bi-globe"></i> Review {index + 1}</strong>
          <small> {new Date(createdAt).toLocaleString('en-US', DATESTRING_OPTIONS)}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body ">
          {reviewBody}
        </div>
      </div>
    ))

      :

      <div className="review-preview">No Reviews Yet </div>
  };

  return (
    
    <div>
      
      <span className="flexbox-container-rv flex-items">

        {/* <div className="flex-items profile-image">{matchProfileIdWithPhoto(profile.profileId)}</div> */}
        <div className="flex-items profile-image">place holder</div>
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

          <p className="num-likes-rv">
            Likes: {profile.profileLikes}
          </p>
        </div>
        <div className="flex-items reviews">

          <div class="m-4">
            <div class="toast-container container-right">
              {renderReviews()}
            </div>
          </div>

        </div>

        
      </span>

      
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
          <LoaderButton
            block="true"
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      </div>
            

    </div>
    
    
  );
}

