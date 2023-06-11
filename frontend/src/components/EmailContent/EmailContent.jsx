import React from "react";
import classes from "./EmailContent.module.css";

export const EmailContent = ({ email }) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.sender}>
          <span>{email.senderName}</span>
          <span className={classes.dateTime}>{email.dateTime}</span>
        </div>
        <div className={classes.subject}>{email.subject}</div>
        <div className={classes.to}>To: me, or someone or sth</div>
      </div>

      <div className={classes.content}>
        Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
      </div>
    </div>
  );
};