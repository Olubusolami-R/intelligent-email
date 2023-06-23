from models import db, User, Email
from app import app

def update_emails_unread_status():
    with app.app_context():
        emails = Email.query.all()
        # Retrieve all emails from the database

        for email in emails:
            email.unread = False  # Set the unread status to False
            email.update()  # Update the email in the database

    print("Unread status updated for all emails.")

update_emails_unread_status()
