import React from "react";
import classes from "./Button.module.css";

const sizes = {
  small: classes.smallButton,
  medium: classes.mediumButton,
  large: classes.largeButton,
};

export const Button = ({ text, onClick, size = "large" }) => {
  return (
    <button className={`${classes.button} ${sizes[size]}`} onClick={onClick}>
      <span>{text}</span>
    </button>
  );
};
