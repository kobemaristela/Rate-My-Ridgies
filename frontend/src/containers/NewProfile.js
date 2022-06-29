import React, { useRef, useState } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../lib/errorLib";
import { s3Upload } from "../lib/awsLib";
import config from "../config";
import "./NewProfile.css";
import Nav from "react-bootstrap/Nav";
import ParticlesBg from 'particles-bg';
import Navbar from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';

// TODO: get picture to work in all profiles view
// TODO: make call to review api to add review after profile created

export default function NewProfile() {
  const file = useRef(null);
  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [submitAnon, setSubmitAnon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  const createReview = async (genProfileId) => API.post("reviews", "/reviews", {
    body: {
      revieweeProfileId : genProfileId,
      reviewBody: content,
      revieweeName: profileName
       },
  });


  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {

      let generatedProfileId = (await createProfile(
        {
          "profileName": profileName,
          "profileRole": profileRole,
          // "profilePhoto": attachment
          "profilePhoto": "test.png"
        }
      )).profileId;

      

      createReview(generatedProfileId);
      file.current = renameFile(file, generatedProfileId + ".png")

      
      const attachment = file.current ? await s3Upload(file.current) : null;


      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createProfile(profile) {
    return API.post("profiles", "/profiles", {
      body: profile,
    });
  }

  return (
    <div className="NewProfile">
      <ParticlesBg type="cobweb" bg={true} />

      <Navbar collapseOnSelect bg="light" expand="lg" fixed="top" >
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/ridgeline-icon.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="ridgeline-icon"
            />
            Review the Ridgies
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="justify-content-end" style={{ width: "100%" }} >
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={profileName}
            as="input"
            onChange={(e) => setProfileName(e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId="Role">
          <Form.Label>Role</Form.Label>
          <Form.Control
            value={profileRole}
            as="input"
            onChange={(e) => setProfileRole(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="content">
          <Form.Label>Review</Form.Label>
          <Form.Control
            value={content}
            as="textarea"
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>


        <Form.Group className="mb-3 checkbox">
          <Form.Check
            type="checkbox"
            label="Submit Anonymously"
            value={submitAnon}
            onChange={(e) => setSubmitAnon(!submitAnon)}
          />
        </Form.Group>

        <LoaderButton
          block="true"
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );

//   return (
//     <form>
//       <h3>Create Profile</h3>
//       <div className="mb-3">
//         <label>First name</label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="First name"
//         />
//       </div>
//       <div className="mb-3">
//         <label>Last name</label>
//         <input type="text" className="form-control" placeholder="Last name" />
//       </div>
//       <div className="mb-3">
//         <label>Role</label>
//         <input
//           // type="email"
//           className="form-control"
//           placeholder="Enter role at the company"
//         />
//       </div>
//       <div className="mb-3">
//         <label>Password</label>
//         <input
//           // type="password"
//           className="form-control"
//           placeholder="Enter password"
//         />
//       </div>
//       <div className="d-grid">
//         <button type="submit" className="btn btn-primary">
//           Sign Up
//         </button>
//       </div>
//       <p className="forgot-password text-right">
//         Already registered <a href="/sign-in">sign in?</a>
//       </p>
//     </form>
//   )
}
