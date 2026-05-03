# Import required libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase connection
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- ROUTES ---------------- #

@app.route("/")
def home():
    return {"message": "Flask API is running"}

# GET videos
@app.route("/products", methods=["GET"])
def get_products():
    res = supabase.table("products").select("*").execute()
    return jsonify(res.data)

# POST video
@app.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()

    if not data or not data.get("title"):
        return {"error": "Title required"}, 400

    new_product = {
        "title": data.get("title")
    }

    res = supabase.table("products").insert(new_product).execute()
    return jsonify(res.data)

# DELETE video
@app.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    supabase.table("products").delete().eq("id", id).execute()
    return {"message": "Deleted"}

# RUN
if __name__ == "__main__":
    app.run(debug=True, port=5001)