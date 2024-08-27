"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_mail import Message
from api.mail.mailer import send_email
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



@api.route('/mailer/<address>', methods=['POST'])
def handle_mail(address):
   return send_email(address)


@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    #user = User.query.filter_by(email=email, password=password).first()
    user = User.query.filter_by(email=email).first()
    if user: 
        if (user.password == password):
            access_token = create_access_token(identity=user.id)
            return jsonify({'success': True, 'user': user.serialize(), 'token': access_token}), 200
        return jsonify({'success': False, 'msg': 'Combinacion usuario/contraseña no es valida'}), 400
    return jsonify({'success': False, 'msg': 'El correo electronico no tiene una cuenta asociada'}), 404

@api.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email or not password:
        return jsonify({'success': False, 'msg': 'Todos los campos son necesarios'}), 400
    #user = User.query.filter_by(email=email, password=password).first()
    user = User.query.filter_by(email=email).first()
    if user: 
        return jsonify({'success': False, 'msg': 'El correo electronico ya tiene una cuenta, intenta iniciar sesion'}), 400
    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.id)
    return jsonify({'success': True, 'user': new_user.serialize(), 'token': access_token}), 200


@api.route('/token', methods=['GET'])
@jwt_required()
def check_jwt():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({'success': True, 'user': user.serialize()}), 200
    return jsonify({'success': False, 'msg': 'Bad token'}), 401


@api.route('/protected', methods=['GET'])
@jwt_required()
def handle_protected():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)   
    if user: 
        print(user.serialize()) 
        return  jsonify({'success': True, 'msg': 'Has logrado acceder a una ruta protegida '})
    return jsonify({'success': False, 'msg': 'Bad token'})

@api.route("/check_mail", methods=['POST'])
def check_mail():
    try:
        data = request.json
        print(data)
        user = User.query.filter_by(email=data['email']).first()
        print(user)
        if not user:
            return jsonify({'success': False, 'msg': 'email not found'}),404
        token = create_access_token(identity=user.id)
        result = send_email(data['email'], token)
        print(result)
        return jsonify({'success': True, 'token': token, 'email': data['email']}), 200
    except Exception as e:
        print('error: '+ e)
        return jsonify({'success': False, 'msg': 'something went wrong'})

@api.route('/password_update', methods=['PUT'])
@jwt_required()
def password_update():
    try:
        data = request.json
        id = get_jwt_identity()
        user = User.query.get(id)
        user.password = data['password']
        db.session.commit()
        return jsonify({'success': True, 'msg': 'Contraseña actualizada exitosamente, intente iniciar sesion'}), 200
    except Exception as e:
        db.session.rollback()
        print('error: '+ e)
        return jsonify({'success': False, 'msg': 'something went wrong'})