from flask_mail import Message
from api.mail.mail_config import mail
from flask import jsonify

def send_email(address, token):
    try:
        msg = Message("Reset your password",  # Asunto del correo
                      recipients=[address])  # Correo del destinatario

        # Definir cuerpo del correo
        msg.html = f'''<a href="https://studious-spork-q57vjgxrwqxh45j7-3000.app.github.dev/reset?token={token}">Hola, sigue este vinculo para resetear tu contraseña</a>'''

        # Enviar el correo
        mail.send(msg)
        return {'success': True, 'msg': 'correo enviado exitosamente'}
    except Exception as e:
        return {'success': False, 'msg': 'error all enviar correo' + e}