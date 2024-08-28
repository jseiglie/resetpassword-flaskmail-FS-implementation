import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Single = () => {
	const { store, actions } = useContext(Context);
	//utilizamos useLocation para poder manejar valores grandes ya que useParams no permite este tipo de valores 
	const location = useLocation();
	//almacenamos en variable queryParams la busqueda realizada que se encuentra en el url
	const queryParams = new URLSearchParams(location.search);
	//extraemos el token del queryPArams
	const token = queryParams.get('token');
	const [password, setPassword] = useState('')
	const [user, setUser] = useState()
	const navigate = useNavigate()
	const [success, setSuccess] = useState('')
	useEffect(() => {
		if (token) {
			//creamos funcion async para que el correcto uso del useEffect 
			const fetchData = async () => {

				//verificamos que el token sea correcto y podemos saber que usuario es el que esta accediendo con la identidad del token
				const resp = await actions.checkAuth(token);
				setUser(prev => prev = resp.user)
			}
			fetchData()
		}
		else {
			alert('Link expiró, intentelo de nuevo')
		}
	}, [token]);


	const handleClick = async () => {
		//pasamos a la actions.updatePassword el password y el token
		const resp = await actions.updatePassword(password, token)
		if (resp.success) {
			setSuccess(true)
			setTimeout(navigate('/'), 1000)

		}
		else {
			setSuccess(false)
		}
	}

	return (
		<div className="card w-75">
			<h2>Cambio de contraseña</h2>
			<p>Hola {user && user.email}, vamos a cambiar la contraseña</p>
			<input
				type="password"
				onChange={e => setPassword(e.target.value)}
				value={password}
			/>
			<button onClick={handleClick}>change password</button>

			{
				success !== '' ?
					success ?
						<div className="container bg-success"> se ha actualizado la contraseña exitosamente</div>
						:
						<div className="container bg-danger"> hubo un problema</div>
					:
					''
			}
		</div>
	);
};
