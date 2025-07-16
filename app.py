from flask import Flask, request, redirect, url_for, flash, render_template
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
app = Flask(__name__)
app.secret_key = 'abcd'
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/say-hi')
def say_hi():
    return render_template('say_hi.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        send_email(name, email, subject, message)
        flash('Thanks for reaching out! I’ll get back to you soon.')
        return redirect(url_for('contact'))

    return render_template('contact.html')

def send_email(name, email, subject, message):
    sender_email = "partearyan713@gmail.com"
    receiver_email = "partearyan713@gmail.com"
    app_password = "pguskpszbckkvcpe"

    # Construct the email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"New Contact Form Submission: {subject or 'No Subject'}"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    # Email content
    text = f"""
You have received a new message from your portfolio website.

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message}
"""
    part = MIMEText(text, "plain")
    msg.attach(part)

    # Send the email via Gmail SMTP
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, app_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print("Email sent successfully.")
    except Exception as e:
        print("Failed to send email:", e)

if __name__ == '__main__':
    app.run(debug=True)
