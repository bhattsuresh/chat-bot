from nltk.chat.util import Chat, reflections
from flask import Flask, render_template, request
from flask_cors import CORS
pairs = [
    [
        r"my name is (.*)",
        ["Hello %1, How are you today ?",]
    ],
    [
        r"I am (.*)",
        ["Hello %1, I am Bot developed by Suresh Bhatt",]
    ],
    [
        r"how are you ?",
        ["I'm doing good\nHow about You ?", ]
    ],
    [
        r"sorry (.*)",
        ["Its alright", "Its OK, never mind", ]
    ],
    [
        r"how are you|how r u",
        ["I am good",]
    ],
    [
        r"I am good|I m good",
        ["Yas!",]
    ],
    [
        r"hi|hey|hello",
        ["Hello", "Hey there", ]
    ],
    [
        r"Bye",
        ["Bye, Have a good day", ]
    ],
]

app = Flask(__name__, template_folder='templates')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
@app.route('/', methods=['GET', 'POST'])
def samplefunction():
    if request.method == 'GET':
        return render_template('index.html',bot1="hi")
    if request.method == 'POST':
        greetIn = request.form['human']
        greetOut = c(greetIn)
        return render_template('index.html',bot1=greetOut)



@app.route('/api/check-api', methods=['GET'])
def check_api():
    return {"apikey":"demo_api_key","is_online":True}

@app.route('/api/send-message', methods=['POST'])
def send_message():
    user_msg = request.form['message']
    reply = c(user_msg)
    return {"reply":reply}


def c(x):
  chat=Chat(pairs,reflections)
  return chat.start(x)

if __name__ == '__main__':
    app.run(host='127.0.4.21', port=5000, debug=True)