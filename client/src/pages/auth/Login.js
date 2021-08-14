import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { validateUser, checkUser } from "../../functions/auth";
import { Row, Col } from "reactstrap";
import Button from "@material-ui/core/Button";
import firebase from "../../firebase";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

const Login = ({ history }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const [userError, setUserError] = useState("");

  let dispatch = useDispatch();

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
          // console.log("USER CHECKED", res);
          if (res.data.err) {
            toast.info("Please signup");
            setUserError(res.data.err);
            setLoading(false);
            return;
          }
          setUserError("");
          firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((res) => {
              // console.log("Success");
              setLoading(false);
              let code = window.prompt("Enter OTP");
              if (code === null) {
                toast.info("Invalid OTP!! Please try again");
                window.location.reload();
                return;
              }
              res
                .confirm(code)
                .then((result) => {
                  // console.log("job done ------->", result);
                  toast.success("Phone Number Verified");
                  setVerify(true);
                })
                .catch((err) => {
                  toast.info("Invalid OTP!! Please try again");
                  window.location.reload();
                });
            })
            .catch((err) => {
              // console.log("OTP ERROR", err);
              window.location.reload();
              toast.info("Please try again");
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
    // setLoading(true);
    e.preventDefault();

    if (verify) {
      // get user token
      let user = auth.currentUser;
      console.log("currrent userrsrr", user);
      if (user === null) {
        toast.error("something went wrong, please try again!");
        window.location.reload();
        return;
      }
      try {
        const idTokenResult = await user.getIdTokenResult();

        //redux store
        console.log("user", user, "idTokenResult----->", idTokenResult);

        validateUser(idTokenResult.token)
          .then((res) => {
            console.log("DONE", res);
            if (res.data.err) {
              toast.error("Please signup", res.data.err);
              setUserError(res.data.err);
              return;
            }
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                phone: res.data.phone_number,
                token: idTokenResult.token,
                _id: res.data._id,
              },
            });

            //redirect
            history.push("/");
            setVerify(false);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        window.location.reload();
      }
    }
  };

  return (
    <div>
      <div>
        {loading && <h2 className="text-danger">Loading...</h2>}
        <h2 className="mt-2">LOGIN</h2>
        <hr />
        <form>
          <div id="sign-in-button"></div>
          <Row>
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
                  autoFocus
                  className="form-control"
                  placeholder="enter registered phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {userError && (
                <p className="text-danger">{userError}, Please Register </p>
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
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-start">
            {verify ? (
              <Button
                type="submit"
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Log in
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled
              >
                Verify number to Login
              </Button>
            )}
            <Link className="redirect-link ml-md-3 mt-2" to={"/register"}>
              Create an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
