from flask import Flask, jsonify
from pycoingecko import CoinGeckoAPI
from pprint import pprint


cg = CoinGeckoAPI()

app = Flask(__name__)
app.secret_key = 'BAD_SECRET_KEY'

pprint(cg.get_coins_markets(vs_currency='usd'))


# @app.route("/getCoins",methods = ["GET", "POST"])
# def getCoins():
#     return jsonify(cg.get_coins_markets(vs_currency='usd'))


# if '__main__' == __name__:
#     app.run()