import osmnx as ox
from flask import Flask, render_template, request, send_file
from flask_cors import CORS
app = Flask(__name__,static_url_path='', static_folder='static')
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    arry = []
    record = {}
    if request.method == 'POST':
        lat1 = float(request.form['lat1'])
        lng1 = float(request.form['lng1'])
        lat2 = float(request.form['lat2'])
        lng2 = float(request.form['lng2'])
        city = ox.graph_from_point((lat1, lng1), dist=1000, network_type='drive')
        start = ox.get_nearest_node(city, (lat1, lng1))
        end = ox.get_nearest_node(city, (lat2, lng2))
        path = ox.shortest_path(city, start, end)
    for x in path:
        lat = city.nodes[x]['y']
        lng = city.nodes[x]['x']
        arry.append({
            'lat':lat,
            'lng':lng
        })
    record['path'] = arry
    return record

if __name__ == "__main__":
    app.run(debug=True )