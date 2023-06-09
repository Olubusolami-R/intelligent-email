import React from "react";
import classes from "./Empty.module.css";

export const Empty = ({ text }) => {
  return <div className={classes.container}>{text}</div>;
};
