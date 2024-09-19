import styled from "styled-components";
import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
// import logo from "../assets/logo.png";
import { gapi } from "gapi-script";
import { client } from "../client";
import TelegramLogin from "./Telegram_login";
import { fetchAuth } from "../utils/fetchAuth";
import { v4 as uuidv4 } from "uuid";

const Form = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: process.env.REACT_APP_GOOGLE_API_TOKEN });
    });
  }, []);

  const responseGoogle = async (response) => {
    if (response.error) {
      setError("Google Login failed. Try again.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl, email } = response.profileObj;

    // find user by mail and know how to set password ...

    const query = fetchAuth();

    const params = { email };
    const user = await client.fetch(query, params);
    let password = "";
    if (!user) {
      password = "GoogleIt";
    } else {
      password = user.password;
    }
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
      email: email,
      password: password,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const query = fetchAuth();
      const params = { email };
      const user = await client.fetch(query, params);

      if (!user) {
        setError("User not found.");
        return;
      }

      if (user.password === password) {
        const u2 = {
          googleId: user._id,
          name: user.userName,
          imageUrl: user.image,
          email: email,
        };

        localStorage.setItem("user", JSON.stringify(u2));

        navigate("/", { replace: true });
      } else {
        setError("Invalid email or password ");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot password feature is not implemented.");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const query = fetchAuth();
      const params = { email };
      const user = await client.fetch(query, params);

      if (user) {
        setError("User already exists. Please login.");
        return;
      }

      const userId = String(uuidv4());

      const doc = {
        _type: "user",
        _id: userId,
        email,
        password,
        UserName: name,
        Image:""
      };

      const u2 = {
        googleId: userId,
        name: name,
        imageUrl: "",
        email: email,
      };

      localStorage.setItem("user", JSON.stringify(u2));

      await client.create(doc);
      navigate("/", { replace: true });


    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup. Please try again.");
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <StyledWrapper>
      <div className="flex justify-start items-center flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
            <form
              className="form"
              onSubmit={isSignUp ? handleSignUp :handleLogin }>
              {isSignUp && (
                <>
                  <div className="flex-column">
                    <label>Name </label>
                  </div>
                  <div className="inputForm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 64 64"
                      strokeWidth="3"
                      stroke="#000000"
                      fill="none">
                      <circle cx="32" cy="18.14" r="11.14" />
                      <path d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z" />
                    </svg>
                    <input
                      type="name"
                      className="input"
                      placeholder="Enter your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="flex-column">
                <label>Email </label>
              </div>
              <div className="inputForm">
                <svg
                  height="20"
                  viewBox="0 0 32 32"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg">
                  <g id="Layer_3" data-name="Layer 3">
                    <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                  </g>
                </svg>
                <input
                  type="email"
                  className="input"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex-column">
                <label>Password </label>
              </div>
              <div className="inputForm">
                <svg
                  height="20"
                  viewBox="-64 0 512 512"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                  <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                </svg>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isSignUp && (
                <>
                  <div className="flex-column">
                    <label>Confirm Password </label>
                  </div>
                  <div className="inputForm">
                    <svg
                      height="20"
                      viewBox="-64 0 512 512"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                      <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                    </svg>
                    <input
                      type="password"
                      className="input"
                      placeholder="Confirm your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {error && <p className="error">{error}</p>}

              {!isSignUp && (
                <div className="flex-row">
                  <span className="span" onClick={handleForgotPassword}>
                    Forgot password?
                  </span>
                </div>
              )}

              <button type="submit" className="button-submit">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>

              <p className="p">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <span className="span" onClick={handleToggle}>
                  {isSignUp ? "Log In" : "Sign Up"}
                </span>
              </p>
              <p className="p line">Or With</p>

              <div className="flex-row">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="btn google"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}>
                      <FcGoogle className="mr-4" />
                      Google
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />
                <TelegramLogin />
              </div>
            </form>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: #252727;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }

  .error {
    color: red;
    font-size: 14px;
  }
`;

export default Form;
