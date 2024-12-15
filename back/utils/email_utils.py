import smtplib
from email.mime.text import MIMEText

def send_verification_email(email, token):
    verify_link = f"http://localhost:3000/verify?token={token}"
    subject = "Verify Your Email Address"
    body = f"Please click the following link to verify your email: {verify_link}"
    
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "hgbao226@gmail.com"
    msg["To"] = email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("hgbao226@gmail.com", "przw hnpd kpyw psmh")
            server.sendmail("hgbao226@gmail.com", email, msg.as_string())
    except Exception as e:
        print(f"Error sending email: {e}")
