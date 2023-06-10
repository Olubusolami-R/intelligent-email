from flask import Flask, render_template, request
import smtplib, os
from details import login_details

app = Flask(__name__)

@app.route('/')
def home():
    return 'baby steps'

@app.route('/login')
def login():
    # sender_email = request.form['sender_email']
    # password = request.form['password']
    try:
        details=login_details()
        server=smtplib.SMTP(host="smtp.office365.com",port=587)
        server.starttls()
        server.login(details[0], details[1])
        server.quit()
        return 'login successful'
        
    except Exception as e:
        return f'An error occurred: {str(e)}'
    

@app.route('/send_email', methods=['POST'])
def send_email():
    
    subject="What's popping?"
    message="Just testing out my endpoints what you sayinggggg?"
    details=login_details()
    try:
        # Construct the email message
        server=smtplib.SMTP(host="smtp.office365.com",port=587)
        server.starttls()
        server.login(details[0], details[1])
        email_message = f'Subject: {subject}\n\n{message}'
        
        # Send the email
        server.sendmail(details[0],"busolasogunle@gmail.com", email_message)
        
        # Close the connection
        server.quit()
        
        return 'Email sent successfully!'
    except Exception as e:
        return f'An error occurred: {str(e)}'

# @app.route('/retrieve_email', methods=['POST']) 
# def retrieve_email():
    #should be able to display specified amount of recent emails
    
    # Get form data
    
    # recipient_email = request.form['recipient_email']
    # subject = request.form['subject']
    # message = request.form['message']