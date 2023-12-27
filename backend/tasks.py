from email.mime.text import MIMEText
import imaplib,os
import smtplib
from app import celery, send_auto_response
import email
from celery.utils.log import get_task_logger
from models import db,Email,EmailThread,Recipient,User
from flask import jsonify
from details import get_details

logger = get_task_logger(__name__)

#Auto-response handler function
def send_auto_response(recipient, subject, message):
    # Configure the SMTP server
    smtp_host = "smtp.office365.com"
    smtp_port = 587
    smtp_username = get_details()[0]
    smtp_password = get_details()[1]

    # Create the email message
    msg = MIMEText(message)
    msg['Subject'] = f"Re: {subject}"
    msg['From'] = smtp_username
    msg['To'] = recipient

    # Send the email
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)

    return "Auto-response sent!"

@celery.task
def poll_inbox():
    # Connect to the email server
    username=get_details()[0]
    password=get_details()[1]
    print("hiii")
    print(username,password)
    user=User.query.filter_by(email=username.lower()).first()
    user_id=user.id
    imap_server = "outlook.office365.com"
    imap = imaplib.IMAP4_SSL(imap_server)
    imap.login(username, password)

    imap.select("INBOX")

    # Search for unread emails
    status, data = imap.uid("search", None, "UNSEEN")
    email_uids = data[0].split()

    emails=[]
    if status == "OK":
        # Process each unread email
        for email_uid in email_uids:
            # Get the email content
            m={}
            print(email_uid)
            stat, data = imap.uid("fetch", email_uid, "(RFC822)")

            if stat == "OK":
                raw_email = data[0][1]
                email_ = email.message_from_bytes(raw_email)

                # Extract relevant information from the email
                m['sender'] = email_["From"]
                m['subject'] = email_["Subject"]
                m['content'] = ""

                # Process different parts of the email
                if email_.is_multipart():
                    for part in email_.get_payload():
                        if part.get_content_type() == "text/plain":
                            m['content'] += part.get_payload()
                else:
                    m['content'] = email_.get_payload()
                
                m['sid']=email_uid.decode()
                m['recipients']=email_['To']
                recipients_data = [m['recipients']]
                m['tid']=1000000000
                m['date']=email_['Date']
                print(m)
                #try adding the new email to the database
                try:
                    # email_obj = Email(sender=sender, subject=subject, content=content)
                    # db.session.add(email_obj)
                    # db.session.commit()
                    thread = EmailThread.query.filter_by(id=m['tid']).first()
                    if not thread:
                        thread = EmailThread(user_id=user_id,emails=[])
                        db.session.add(thread)
                        db.session.flush()

                    new_email = Email(server_id=m['sid'], subject=m['subject'], content=m['content'], sender=m['sender'], date=m['date'], thread_id=thread.id, unread=True)
                    db.session.add(new_email)
                    db.session.flush()

                    recipients = []
                    for recipient_data in recipients_data:
                        recipient = Recipient(email_id=new_email.id, recipient=recipient_data)
                        recipients.append(recipient)
                    
                    new_email.recipients = recipients
                    db.session.commit()

                    #Send auto-response (GPT model is to be called here)
                    auto_response = "Thank you for your email!"
                    send_auto_response(m['sender'], m['subject'], auto_response)

                    # Add the auto-response to the database
                    new_reply = Email(
                        server_id=0,
                        subject=f"Re: {m['subject']}",
                        content=auto_response,
                        sender=get_details()[0],
                        date=m['date'],
                        thread_id=thread.id,
                        unread=True
                    )
                    db.session.add(new_reply)
                    db.session.commit()
                            
                except Exception as e:
                    # Return an error response
                    return {'error': str(e)}, 500


                emails.append(m)
                # # Send an auto-response
                # if emails!=[]:
                #     for x in emails:
                #         #gpt model meant to be called here
                        
                        
    logger.info(emails)
