import React, { useState } from "react";
import classes from "./EmailContent.module.css";
import { Button } from "../Button/Button";
import { EmailReply, EmailTextArea } from "../EmailReply/EmailReply";

export const EmailContent = ({ email }) => {
  const [showReply, setShowReply] = useState(false);
  console.log(email, email.content, 'email content')

  if (!email.content) {
    // Handle the case where email content is not an array
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.subject}>Error: Invalid email content format</div>
        </div>
      </div>
    );
  }

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

      <div className={classes.content} dangerouslySetInnerHTML={{ __html: email.content }}/>
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
