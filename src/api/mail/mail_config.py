from flask_mail import Mail
#creamos instancia de Mail para poderla utilizar tanto en app.py como en routes
mail = Mail()
#tenemos que crear un password para aplicaciones inseguras aqui: https://myaccount.google.com/apppasswords