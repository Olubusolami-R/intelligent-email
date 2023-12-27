from flask import Flask, render_template, request
import smtplib, os
from details import login_details
from models import db, User, Email, Recipient, EmailThread
from flask_moment import Moment
from flask_migrate import Migrate
from flask import Flask, request, jsonify
import imaplib
from email.parser import HeaderParser
import email
from sqlalchemy import desc
from celery import Celery
from email.mime.text import MIMEText
from celery import Celery


import imaplib
import email

# @celery.task
def poll_inbox(user_id):
    username = "*******"
    password = "*******"
    imap_server = "outlook.office365.com"

    try:
        # Connect to the IMAP server
        imap = imaplib.IMAP4_SSL(imap_server)
        imap.login(username, password)

        # Select the INBOX mailbox
        imap.select("INBOX")

        # # Search for all emails in the mailbox and retrieve the UID
        # _, data = imap.uid("search", None, "ALL")
        # email_uids = data[0].split()

        # emails = []

        _, data = imap.uid("search", None, "UNSEEN")
        email_uids = data[0].split()

        emails=[]

        for email_uid in email_uids:
            # Fetch the email data
            print(email_uid)
            _, data = imap.uid("fetch", email_uid, "(RFC822)")
            raw_email = data[0][1]

            # Parse the raw email data
            email_message = email.message_from_bytes(raw_email)

            # Extract the desired email fields
            sender = email_message["From"]
            recipients = email_message["To"]
            subject = email_message["Subject"]
            content = ""

            # Process the email content
            if email_message.is_multipart():
                for part in email_message.get_payload():
                    if part.get_content_type() == "text/plain":
                        content = part.get_payload()
                        break
            else:
                content = email_message.get_payload()

            # Store the email data
            email_data = {
                "uid": email_uid.decode(),  # Convert bytes to string
                "sender": sender,
                "recipients": recipients,
                "subject": subject,
                "content": content
            }
            emails.append(email_data)

        # Close the IMAP connection
        imap.close()
        imap.logout()

        return emails

    except Exception as e:
        # Handle any exceptions that occur during email retrieval
        # You may choose to log the error or perform any necessary actions
        print(f"Error retrieving emails: {str(e)}")
        return []

print(poll_inbox())
