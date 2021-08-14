import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import firebase from "../../firebase";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createOrUpdateUser, checkUser } from "../../functions/auth";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Button from "@material-ui/core/Button";

const Register = ({ history }) => {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [phone, setPhone] = useState("");
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState("");
  const [userError, setUserError] = useState("");

  let dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const setUpReCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          console.log("captcha resolved");
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          handlePhoneSubmit();
        },
      }
    );
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      toast.error("Phone Number must be 10 digits!");
      return;
    }
    setLoading(true);
    setUpReCaptcha();

    const phoneNumber = "+91" + phone;
    const appVerifier = window.recaptchaVerifier;

    try {
      checkUser({ phoneNumber })
        .then((res) => {
          if (res.data.ok) {
            toast.error("Please Login");
            setUserError(res.data.ok);
            setLoading(false);
            return;
          }
          setUserError("");
          firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((res) => {
              console.log("Success");
              setLoading(false);
              let code = window.prompt("Enter OTP");
              if (code === null) {
                return;
              }

              res
                .confirm(code)
                .then((result) => {
                  // console.log("job done ------->", result);
                  setVerify(true);
                  toast.success("Phone Number Verified");
                  setLoading(false);
                })
                .catch((err) => {
                  setLoading(false);
                  toast.error("Invalid OTP!! Please try again");
                  window.location.reload();
                });
            })
            .catch((err) => {
              toast.error("Please try again");
              window.location.reload();
              console.log(err);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error ------->", err);
      toast.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validation
    if (!email || !fname) {
      toast.error("Required fields cannot be empty!");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Phone Number must be 10 digits!");
      return;
    }
    setLoading(true);

    if (verify) {
      // get user token
      let user = auth.currentUser;
      console.log("currrent userrsrr", user);
      const idTokenResult = await user.getIdTokenResult();

      //redux store
      console.log("user", user, "idTokenResult----->", idTokenResult);

      createOrUpdateUser({ fname, email }, idTokenResult.token)
        .then((res) => {
          if (res.data.err) {
            toast.error("Please signup", res.data.err);
            setUserError(res.data.err);
            return;
          }
          console.log("DONE", res);
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: fname,
              email: email,
              phone: res.data.phone_number,
              token: idTokenResult.token,
              _id: res.data._id,
            },
          });
        })
        .catch((err) => console.log(err));
      setLoading(false);
      //redirect
      history.push("/");
    }
  };

  return (
    <div className="contact">
      <div className="signup-form">
        {loading && <h2 className="text-danger">Loading...</h2>}
        <h2 className="mt-2">SIGN UP</h2>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <div id="sign-in-button"></div>
          <Row>
            <Col xs="12" md="6">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="12" md="3">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="fname"
                  className="form-control"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
            </Col>
            <Col xs="12" md="3">
              <div className="form-group">
                {verify ? (
                  <label className="text-success">Phone Number</label>
                ) : (
                  <label>Phone Number</label>
                )}
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {userError && (
                <p className="text-danger">{userError}, Please Login </p>
              )}

              {verify ? (
                <p className="item-label text-right text-success">
                  Verified
                  <VerifiedUserIcon fontSize="small" className="text-success" />
                </p>
              ) : (
                <Button
                  type="submit"
                  onClick={handlePhoneSubmit}
                  variant="contained"
                  color="primary"
                  className="float-right"
                >
                  Get OTP?
                </Button>
              )}
            </Col>
          </Row>
          <hr />
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            {verify ? (
              <Button type="submit" variant="contained" color="primary">
                Sign Up
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled
              >
                Verify number to SignUp
              </Button>
            )}
            <Link className="mt-3 mt-md-0 redirect-link" to={"/login"}>
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
