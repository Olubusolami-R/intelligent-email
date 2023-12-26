from sqlalchemy import Column, String, Integer
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

database_name = 'autoresponse'
database_path = 'postgresql://{}/{}'.format('localhost:5432', database_name)

def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()

class User(db.Model):
    __tablename__='users'
    id = Column(Integer, primary_key=True)
    email=Column(String)
    password=Column(String)
    preference=Column (String)
    threads = db.relationship('EmailThread', backref='user', lazy=True)

    def __init__(self, email, password, preference):
        self.email = email
        self.password=password
        self.preference = preference

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'email': self.email,
            'response method': self.preference
            }

class Email(db.Model):
    __tablename__ = 'emails'

    id = db.Column(db.Integer, primary_key=True)  # Your database's primary key
    server_id = db.Column(db.String(255), unique=True)  # Server-side ID provided by the email server
    subject = db.Column(db.String(255))
    content = db.Column(db.Text)
    sender = db.Column(db.String(255))
    recipients = db.relationship('Recipient', backref='email', lazy=True, cascade="all, delete-orphan")
    thread_id = db.Column(db.Integer, db.ForeignKey('email_threads.id'))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    preview = db.Column(db.String(255))
    unread = db.Column(db.Boolean, default=True)
    
    def __init__(self,server_id, subject, content, sender, date, thread_id,  recipients=None, unread=True):
        self.server_id =server_id
        self.subject=subject
        self.content = content
        self.sender=sender
        self.recipients=recipients or []
        self.thread_id = thread_id
        self.date=date
        self.unread=unread
        content_list=content.split("\n\n")
        if len(content_list)==1:
            self.preview=content_list[0]
        else:
            self.preview=content_list[1]
        
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        recipients = [recipient.recipient for recipient in self.recipients]
        return {
            'senderName': self.sender,
            'subject': self.subject,
            'preview':self.preview,
            'isAutoReply': False,
            'unread': self.unread,
            'dateTime': self.date,
            'content':self.preview,
            'to': recipients,
            'id':self.id
        }


class Recipient(db.Model):
    __tablename__ = 'recipients'

    id = db.Column(db.Integer, primary_key=True)
    email_id = db.Column(db.Integer, db.ForeignKey('emails.id'))
    recipient = db.Column(db.String(255))

    def __init__(self, email_id, recipient):
        self.email_id = email_id
        self.recipient= recipient

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'email_id': self.email_id,
            'recipient': self.recipient
            }

class EmailThread(db.Model):
    __tablename__ = 'email_threads'

    id = db.Column(db.Integer, primary_key=True)
    emails = db.relationship('Email', backref='thread', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self,user_id, emails=None):
        self.user_id = user_id
        self.emails = emails or []
        
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'emails': self.emails
            }