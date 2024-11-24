from flask import Flask, render_template, request, url_for, redirect, session
import pymongo
import bcrypt

app = Flask(__name__)
app.secret_key = "testing"
client = pymongo.MongoClient("mongodb+srv://admin:admin@cnweb.tk1cv.mongodb.net/?retryWrites=true&w=majority&appName=CNWeb")

db = client.get_database('backend')

records = db.users

@app.route("/", methods=['post', 'get'])
def index():

    message = ''

    if "email" in session:
        return redirect(url_for("logged_in"))
    if request.method == "POST":
        username = request.form.get("fullname")
        email = request.form.get("email")
        password = request.form.get("password")
        password2 = request.form.get("password2")

        # user_found = records.find_one({"name": username})
        email_found = records.find_one({"email": email})
        # if user_found:
        #     message = "There is already an user by that name"
        #     return render_template('index.html', message=message)
        if email_found:
            message = "This email is already exists in the database"
            return render_template('index.html', message=message)
        if password != password2:
            message = "Password should match!"
            return render_template('index.html', message=message)
        else:
            hased = bcrypt.hashpw(password2.encode('utf-8'), bcrypt.gensalt())
            user_input = {'name':username, 'email':email, 'password':hased}
            records.insert_one(user_input)


            #if registered redirect to logged in as the registered user
            return redirect(url_for("login"))
    return render_template('index.html')

@app.route("/login", methods=["POST", "GET"])
def login():
    message = "Please login to your account"
    if "email" in session:
        return redirect(url_for("logged_in"))
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        email_found = records.find_one({"email":email})
        if email_found:
            email_value = email_found["email"]
            password_value = email_found["password"]

            if bcrypt.checkpw(password.encode('utf-8'), password_value):
                session["email"] = email_value
                return redirect(url_for('logged_in'))
            else:
                message = "Wrong password"
                return render_template('login.html', message = message)
        else:
            message = "Email not found"
            return render_template('login.html', message = message)
    return render_template('login.html', message = message)

@app.route('/logged_in')
def logged_in():
    if "email" in session:
        email = session["email"]
        return render_template('logged_in.html', email = email)
    else:
        return redirect(url_for('login'))

@app.route('/logout', methods = ["POST", "GET"])
def logout():
    if "email" in session:
        session.pop("email", None)
        return render_template("logged_out.html")
    else:
        return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)