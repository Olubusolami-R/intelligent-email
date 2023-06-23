import React, { useState } from "react";
import classes from "./EmailContent.module.css";
import { Button } from "../Button/Button";
import { EmailReply, EmailTextArea } from "../EmailReply/EmailReply";

export const EmailContent = ({ email }) => {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.sender}>
          <span>{email.senderName}</span>
          <span className={classes.dateTime}>{email.dateTime}</span>
        </div>
        <div className={classes.subject}>{email.subject}</div>
        {/* <div className={classes.to}>To: {email.recipients.join(", ")}</div> */}
        <div className={classes.to}>
          To: {Array.isArray(email.to) ? email.to.join(", ") : ""}
        </div>
      </div>

      <div className={classes.content}>
        {email.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {/* {email.content} */}
        {/* Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
        Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet */}
      </div>
      <div className={classes.buttons}>
        <Button
          icon='reply'
          type='border'
          text='Reply'
          size='smallButton'
          onClick={() => setShowReply(true)}
        />
        <Button icon='ai' type='border' text='AI Reply' size='smallButton' />
      </div>

      {email.reply ? <EmailReply email={email.reply} /> : null}
      {showReply && <EmailTextArea onCancel={() => setShowReply(!showReply)} />}
    </div>
  );
};
