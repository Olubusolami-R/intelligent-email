import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as Bubble } from "../../assets/bubbles.svg";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import classes from "./Login.module.css";

export const Login = () => {
  const history = useHistory();
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
          <form className={classes.form}>
            <Input label='Email' type='email' />
            <Input label='Password' type='password' />

            <Button text='Sign In' onClick={() => history.push("/")} />
          </form>
        </div>
      </div>
    </>
  );
};
