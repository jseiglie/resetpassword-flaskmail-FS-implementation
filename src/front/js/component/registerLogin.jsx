import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const RegisterLogin = () => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [login, setLogin] = useState(true)

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (login) return actions.login(formData)
        actions.register(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="email" onChange={handleChange} />
            <input type="password" name="password" onChange={handleChange} />
            <input type="submit" value={`${login ? 'Login' : 'Sign up'}`} />

            <p>Ya tienes una cuenta? Inicia session <span onClick={() => setLogin(!login)}>AQUI</span></p>
        </form>
    )
}