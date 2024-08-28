from flask_mail import Message
from api.mail.mail_config import mail
from flask import jsonify
import os

def send_email(address, token):
    try:
        msg = Message("Reset your password",  # Asunto del correo
                      recipients=[address])  # Correo del destinatario

        # Definir cuerpo del correo, utilizamos la variable de entorno para PROD os.getenv("BACKEND_URL"), en DEV ponemos la del FRONT si estas usando codespace.
        if  os.getenv("FLASK_DEBUG") == "1":
            msg.html = f'''<a href="https://glowing-space-succotash-9g76r4xvgggh9xww-3000.app.github.dev/reset?token={token}">Hola, sigue este vinculo para resetear tu contraseña</a>'''
        else:
            msg.html = f'''<a href="{os.getenv("BACKEND_URL")}/reset?token={token}">Hola, sigue este vinculo para resetear tu contraseña</a>'''

        # Enviar el correo
        mail.send(msg)
        return {'success': True, 'msg': 'correo enviado exitosamente'}
    except Exception as e:
        return {'success': False, 'msg': 'error al enviar correo' + e}