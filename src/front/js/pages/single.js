import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Single = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const token = queryParams.get('token');
	const [password, setPassword] = useState('')
	const [user, setUser] = useState()
	const navigate = useNavigate()

	useEffect(async () => {
		if (token) {
			const resp = await actions.checkAuth(token);
			setUser(prev => prev = resp.user)
		}
	}, [token]);


	const handleClick = async () => {
		const resp = await actions.updatePassword(password, token)
		if (resp.success) {
			alert('vamos a logearnos ahora!')
			navigate('/')
		}
	}

	return (
		<div className="card w-75">
			<h2>Cambio de contraseña</h2>
			<p>Hola {user && user.email}, vamos a cambiar la contraseña</p>
			<input
				type="text"
				onChange={e => setPassword(e.target.value)}
				value={password}
			/>
			<button onClick={handleClick}>change password</button>
		</div>
	);
};
