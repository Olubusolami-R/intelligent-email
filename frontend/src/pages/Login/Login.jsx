import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as Bubble } from "../../assets/bubbles.svg";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import classes from "./Login.module.css";
import { useState } from "react";

export const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // console.log(event.target.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Make the API call to your Flask backend with email and password
    console.log(email,password)
    console.log("How farrrrr")
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (data.message === "Login successful") {
          // Redirect to the desired page on successful login
          history.push("/");
        } else {
          // Handle failed login attempt
          console.log("Invalid credentials");
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  };

  return (
    <>
      <div className={classes.left}>
        <div className={classes.left__bubble}>
          <Bubble />
        </div>

        <div className={classes.bottom}>
          <div>Welcome to Busola’s email project!</div>
        </div>
      </div>
      <div className={classes.right}>
        <div className={classes.content}>
          <h1 className={classes.header}>Sign in with your Outlook account</h1>
          {/* <form className={classes.form}>
            <Input label='Email' type='email' />
            <Input label='Password' type='password' />

            <Button text='Sign In' onClick={() => history.push("/login")} />
          </form> */}
          <form className={classes.form} onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <Button text="Sign In" type="submit" />
          </form>
        </div>
      </div>
    </>
  );
};
