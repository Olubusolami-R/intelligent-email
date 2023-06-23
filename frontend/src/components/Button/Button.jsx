import React from "react";
import classes from "./Button.module.css";
import { ReactComponent as AIIcon } from "../../assets/ai.svg";
import { ReactComponent as ReplyIcon } from "../../assets/reply.svg";

const sizes = {
  small: classes.smallButton,
  medium: classes.mediumButton,
  large: classes.largeButton,
};

const types = {
  filled: classes.filled,
  border: classes.border,
};

const icons = {
  ai: <AIIcon />,
  reply: <ReplyIcon />,
};

export const Button = ({
  text,
  onClick,
  icon,
  type = "filled",
  size = "large",
}) => {
  return (
    <button
      className={`${classes.button} ${sizes[size]} ${types[type]}`}
      onClick={onClick}
    >
      <span className={classes.icon}>{icon && icons[icon]}</span>
      <span>{text}</span>
    </button>
  );
};
