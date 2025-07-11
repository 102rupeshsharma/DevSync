from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from dotenv import load_dotenv
import bcrypt
import jwt
import os
import datetime
from functools import wraps

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

# Connect to MongoDB
mongo = PyMongo(app)
db = mongo.cx.get_database()
users_collection = db["users"]
projects_collection = db["projects"]

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            token = token.replace("Bearer ", "")
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_collection.find_one({"_id": ObjectId(data["user_id"])})
            if not current_user:
                return jsonify({"message": "User not found"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"message": "Token is invalid", "error": str(e)}), 401
        except Exception as e:
            return jsonify({"message": "Something went wrong", "error": str(e)}), 500

        return f(current_user, *args, **kwargs)
    return decorated


# ========== AUTH ROUTES ==========

@app.route('/signup', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not (username and email and password):
        return jsonify({"message": "All fields are required"}), 400

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"message": "Email already registered"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "username": username,
        "email": email,
        "password": hashed_password
    }

    inserted = users_collection.insert_one(new_user)
    return jsonify({
        "message": "Registration successful",
        "user_id": str(inserted.inserted_id)
    }), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"message": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    }), 200

# ========== PROJECT ROUTES ==========

@app.route('/api/projects', methods=['POST'])
@token_required
def add_project(current_user):
    data = request.get_json()

    if not data.get("name") or not data.get("tech"):
        return jsonify({"message": "Missing fields"}), 400
    
    new_project = {
        "user_id": str(current_user["_id"]),
        "name": data.get("name"),
        "tech": data.get("tech"),
        "description": data.get("description"),
        "status": data.get("status"),
        "url": data.get("url", ""),
        "startDate": data.get("startDate", ""),
        "endDate": data.get("endDate", "")
    }

    result = projects_collection.insert_one(new_project)
    
    # Inject the generated _id into the response
    new_project["_id"] = str(result.inserted_id)

    return jsonify(new_project), 201
@app.route('/api/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    user_id = str(current_user["_id"])
    projects = list(projects_collection.find({"user_id": user_id}))
    for project in projects:
        project["_id"] = str(project["_id"])
    return jsonify(projects), 200

@app.route('/api/projects/<project_id>', methods=['PUT'])
@token_required
def update_project(current_user, project_id):
    data = request.get_json()
    user_id = str(current_user["_id"])

    project = projects_collection.find_one({"_id": ObjectId(project_id), "user_id": user_id})
    if not project:
        return jsonify({"message": "Project not found"}), 404

    updated_data = {
        "name": data.get("name"),
        "tech": data.get("tech"),
        "description": data.get("description"),
        "status": data.get("status"),
        "url": data.get("url", ""),
        "startDate": data.get("startDate", ""),
        "endDate": data.get("endDate", "")
    }

    projects_collection.update_one({"_id": ObjectId(project_id)}, {"$set": updated_data})
    return jsonify({"message": "Project updated"}), 200

@app.route('/api/projects/<project_id>', methods=['DELETE'])
@token_required
def delete_project(current_user, project_id):
    user_id = str(current_user["_id"])
    result = projects_collection.delete_one({
        "_id": ObjectId(project_id),
        "user_id": user_id
    })

    if result.deleted_count == 0:
        return jsonify({"message": "Project not found or not authorized"}), 404

    return jsonify({"message": "Project deleted"}), 200

# ========== SERVER START ==========
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
