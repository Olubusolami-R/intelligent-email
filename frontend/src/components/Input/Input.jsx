import React from "react";
import classes from "./Input.module.css";

export const Input = ({ label, type }) => {
  return (
    <div className={classes.input}>
      <label htmlFor={label}>{label}</label>
      <input type={type} name={label} />
    </div>
  );
};
