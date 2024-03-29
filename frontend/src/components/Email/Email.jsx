import classes from "./Email.module.css";
import React, { useState } from "react";

export const Email = ({ email, onClick }) => {
  const subjectClasses = `${classes.subject} ${email.unread ? classes.unreadSubject : ''}`;
  return (
    <div className={classes.container} onClick={onClick}>
      <div className={classes.sender}>
        <span>{email.senderName}</span>
        {email.isAutoReply && (
          <span className={classes.autoReply}>Auto-Replied</span>
        )}
      </div>
      <div className={`${classes.subject} ${subjectClasses}`}>{email.subject}</div>
      <div className={classes.preview}>{email.preview}</div>
    </div>
  );
};
