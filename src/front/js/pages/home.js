import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { RegisterLogin } from "../component/registerLogin.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const handleLogout = () => {
		actions.logout()
		navigate('/')
	}

	const handleClick = () => {
		actions.sendResetEmail(email)
	}
	return (
		<div className="text-center mt-5">
			<RegisterLogin />


			{localStorage.getItem('token') ?
				<>
					<p>Estas logeado!!!!</p>
					<Link to={'/demo'}>
						ve a demo
					</Link>

					o

					<button onClick={handleLogout}>log out </button>
				</>
				:
				''
			}
			<p>recuperar contraseña</p>
			<input
				type="text"
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<button onClick={handleClick}>
				reset
			</button>
		</div>
	);
};