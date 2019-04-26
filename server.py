from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

current_garden_id = -1
gardens = []

herbs = [
    {
        "id": 0,
        "name": "Rosemary",
        "image": "/static/imgs/rosemary.png"
    },
    {
        "id": 1,
        "name": "Thyme",
        "image": "/static/imgs/thyme.png"
    },
    {
        "id": 2,
        "name": "Mint",
        "image": "/static/imgs/mint.png"
    },
    {
        "id": 3,
        "name": "Basil",
        "image": "/static/imgs/basil.png"
    },
    {
        "id": 4,
        "name": "Parsley",
        "image": "/static/imgs/parsley.png"
    },
    
]

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/custom/<size>')
def custom(size=None):
    return render_template("custom.html", herbs=herbs, size=size)

@app.route('/garden/<garden_id>')
def garden(garden_id=None):
    print(gardens[int(garden_id)])
    return render_template("garden.html", garden=gardens[int(garden_id)], herbs=herbs)

@app.route("/save_garden", methods=['GET', 'POST'])
def save_garden():
    global gardens
    global current_garden_id
    json_data = request.get_json()
    size = json_data["size"]
    pots = json_data["pots"]
    current_garden_id += 1
    new_garden = {
        "size": size,
        "pots": pots,
        "id": current_garden_id
    }
    gardens = gardens + [new_garden]
    path = "/garden/" + str(current_garden_id)
    return jsonify(dict(redirect=path))


if __name__ == '__main__':
   app.run(debug = True)