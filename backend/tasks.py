import imaplib
from app import celery, send_auto_response
import email
from celery.utils.log import get_task_logger
from details import login_details
from models import db,Email,EmailThread,Recipient
from flask import jsonify

logger = get_task_logger(__name__)


@celery.task
def poll_inbox():
    # Connect to the email server
    x=login_details()
    username=x[0]
    password=x[1]

    imap_server = "outlook.office365.com"
    imap = imaplib.IMAP4_SSL(imap_server)
    imap.login(username, password)

    imap.select("INBOX")

    # Search for unread emails
    # status, email_ids = imap.search(None, "UNSEEN")
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

                #try adding the new email to the database
                try:
                    # email_obj = Email(sender=sender, subject=subject, content=content)
                    # db.session.add(email_obj)
                    # db.session.commit()
                    thread = EmailThread.query.filter_by(id=m['tid']).first()
                    if not thread:
                        thread = EmailThread(emails=[])
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
                except Exception as e:
                    # Return an error response
                    return jsonify({'error': str(e)}), 500


                emails.append(m)
                # Send an auto-response
                if emails!=[]:
                    for x in emails:
                        auto_response = "Thank you for your email!"
                        send_auto_response(x['sender'], x['subject'], auto_response)
                #this AR will have an if statement

            # Mark the email as read
            # imap.store(email_uid, "+FLAGS", "\\Seen")

    # Close the connection
    # imap.close()
    # imap.logout()
    logger.info(emails)
