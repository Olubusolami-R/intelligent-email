from flask import Flask, request
import smtplib,os
from models import db, User, Email, Recipient, EmailThread, setup_db
from flask_moment import Moment
from flask_migrate import Migrate
from flask import Flask, request, jsonify
import imaplib
from email.parser import HeaderParser
import email
from sqlalchemy import desc
from celery import Celery
from email.mime.text import MIMEText
import celeryconfig

#Set up Flask app
app = Flask(__name__)
app.config.from_object('config')
app.app_context().push()
setup_db(app)

#Initialize extensions
moment = Moment(app)
migrate=Migrate(app,db)

#Get outlook login details from environment variables
username=os.environ.get('USERNAME')
password=os.environ.get('PASSWORD')

#Define and initialize celery
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['BROKER_URL']
    )
    celery.conf.update(app.config)
    celery.config_from_object(celeryconfig)
    # celery.task()(add_together)
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

celery = make_celery(app)

#Retrieve emails from outlook server
def retrieve_email(): 
    # select a mailbox
    imap_server = "outlook.office365.com"
    imap = imaplib.IMAP4_SSL(imap_server)
    imap.login(username, password)
    result, _ = imap.select("INBOX")
    if result == 'OK':
        # perform search
        result, data = imap.uid('search', None, "ALL")

        if result == 'OK':
            # specify the maximum number of emails to retrieve
            max_emails = 15
            counter = 1
            data_list=data[0].split()
            # data_list.reverse()
            emails=[]
            for num in data_list:
                email_m={}
                if counter >= max_emails:
                    break

                result, data = imap.uid('fetch', num, '(RFC822)')
                if result == 'OK':
                    email_message = email.message_from_bytes(data[0][1])
                    email_m['sid']=num.decode()
                    email_m['sender']=email_message['From']
                    email_m['recipients']=email_message['To']
                    email_m['date']=email_message['Date']
                    email_m['subject']=str(email_message['Subject'])
                    email_m['content']=str(email_message.get_payload()[0])
                    email_m['tid']=counter
                    emails.append(email_m)
                    counter += 1
    imap.close()
    imap.logout()
    print(emails)
    return emails

#Auto-response handler function
def send_auto_response(recipient, subject, message):
    # Configure the SMTP server
    smtp_host = "smtp.office365.com"
    smtp_port = 587
    smtp_username = username
    smtp_password = password

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


@app.route('/')
def home():
    return 'baby steps'

#Create new user in the database
@app.route('/new_user', methods=['POST'])
def create_user():
    print(request)
    if request.is_json:
        data=request.get_json()
        print(data)
        user=User(email=data['email'], password=data['password'], preference=data['preference'])
        db.session.add(user)
        db.session.commit()
        return {"message": f"User {user.email} has been created successfully."}
    else:
        return {"error": "The request payload is not in JSON format"}

#Login to email client
@app.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    email=data['email']
    pword=data['password']
    old_user = User.query.filter_by(email=email).first()
    print(old_user)
    try:
        if old_user.password ==pword:
            print("Correct password")
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'message': 'Bad Request'}), 400


#Called once to populate the database from outlook server  
@app.route('/populate')
def populate_db():
    try:
        # Retrieve and populate emails in the database
        emails = retrieve_email()
        print(emails[0])

        for email in emails:
            sid = email['sid']
            content = email['content']
            subject = email['subject']
            sender = email['sender']
            recipients_data = [email['recipients']]
            date = email['date']
            tid = email['tid']

            # Check if the thread exists or create a new one
            thread = EmailThread.query.filter_by(id=tid).first()
            if not thread:
                thread = EmailThread(emails=[])
                db.session.add(thread)
                db.session.flush()

            new_email = Email(server_id=sid, subject=subject, content=content, sender=sender, date=date, thread_id=thread.id)
            db.session.add(new_email)
            db.session.flush()

            recipients = []
            for recipient_data in recipients_data:
                recipient = Recipient(email_id=new_email.id, recipient=recipient_data)
                recipients.append(recipient)
            
            new_email.recipients = recipients
            db.session.commit()

        # Return a success response
        return jsonify({'message': 'Emails successfully populated in the database.'}), 200

    except Exception as e:
        # Return an error response
        return jsonify({'error': str(e)}), 500

#Retrieve inbox from database
@app.route('/retrieve_inbox', methods=['GET'])
def retrieve_inbox():
    try:
        emails = Email.query.order_by(desc(Email.date)).all()
        formatted_emails = [email.format() for email in emails]
        print(formatted_emails[0])
        return jsonify(formatted_emails)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Mark email message as read once opened
@app.route('/update_email/<int:email_id>', methods=['POST'])
def update_email(email_id):
    email_message=Email.query.get(email_id)
    try:
        email_message.unread=False
        db.session.add(email_message)
        db.session.commit()
        return jsonify({'message': 'Unread is now marked False'}), 200
    except Exception as e:
        # Return an error response
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
