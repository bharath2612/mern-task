import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Button from "@material-ui/core/Button";

const Form = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("url", url);
    console.log("message", message);

    let result = await fetch(`${url}`, {
      method: "post",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    console.log("result", result);
    setResponse(result);
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
              {response && JSON.stringify(response)}
            </div>
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              className="float-right"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default Form;
