import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

const Form = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("url", url);
    console.log("message", message);
    try {
      await fetch(`${url}`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({
          message,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Request Successful");
          setResponse(data);
          setError("");
        })
        .catch((err) => {
          console.log("errorrr", err);
          toast.error("Post Request Failed");
          setResponse("");
          setError("Post Request Failed");
        });
    } catch (err) {
      console.log("errorrr", err);
      toast.error("Post Request Failed");
      setResponse("");
      setError("Post Request Failed");
    }
  };

  return (
    <div>
      <h2 className="mt-2">Form</h2>
      <hr />
      <form>
        <div id="sign-in-button"></div>
        <Row>
          <Col xs="12" md="3" className="align-center">
            <div className="form-group text-center">
              <input
                type="text"
                name="url"
                autoFocus
                className="form-control m-2"
                placeholder="Enter Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <input
                type="text"
                name="message"
                autoFocus
                className="form-control m-2"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              className="float-right"
            >
              Send
            </Button>
          </Col>
          <Col xs="12" md="6" className="text-center">
            {response && (
              <h5 className="text-success">{JSON.stringify(response)}</h5>
            )}
            {error && <h5 className="text-danger">{JSON.stringify(error)}</h5>}
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default Form;
