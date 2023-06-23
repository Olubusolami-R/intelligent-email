import React, { useState } from "react";
import classes from "./EmailReply.module.css";
import { Button } from "../Button/Button";
import { ReactComponent as CancelIcon } from "../../assets/cancel.svg";

export const EmailTextArea = ({ onCancel }) => {
  return (
    <div className={classes.emailReply}>
      <button className={classes.cancelButton} onClick={onCancel}>
        <CancelIcon />
      </button>
      <textarea
        className={classes.textArea}
        placeholder='Write your reply here...'
      ></textarea>
      <button className={classes.replyButton}>Reply</button>
    </div>
  );
};

export const EmailReply = ({ email }) => {
  const [showReply, setShowReply] = useState(false);
  if (!email) return null;
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.sender}>
          <span>
            {email.senderName}{" "}
            <span className={classes.autoReply}>
              {email.isAutoReply ? "(Auto-Reply)" : ""}
            </span>
          </span>
          <span className={classes.dateTime}>{email.dateTime}</span>
        </div>

        <div className={classes.to}>
          To: {Array.isArray(email.to) ? email.to.join(", ") : "Me"}
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
          onClick={() => setShowReply(!showReply)}
        />
      </div>

      {showReply && <EmailTextArea onCancel={() => setShowReply(!showReply)} />}
    </div>
  );
};
