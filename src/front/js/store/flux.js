const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			updatePassword: async (password, token) => {
				//recibimos password nuevo  y el token (lo necesitamos ya que es una ruta protegida la que vamos a consumir y porque del token sacaremos la identidad del usuario)
				try{
					const resp = await fetch(process.env.BACKEND_URL + "/api/password_update", {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({password})
					})
					if (resp.status!=200) return false
					const data = await resp.json()
					console.log(data)
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			sendResetEmail: async (email) => {
				//recibimos el correo al que le vamos a enviar el reset del password 
				try{
					const resp = await fetch(process.env.BACKEND_URL + "/api/check_mail", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({email})
					})
					if (resp.status!=200) return false
					const data = await resp.json()
					console.log(data)
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			logout: ()=> {
				localStorage.removeItem('token')
				setStore({user: null, token: null})
				return true
			},
			checkAuth: async(token) => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/token", {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						method: 'GET',
					})
					if (resp.status!=200) return false
					const data = await resp.json()
					console.log(data)
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			login: async (formData) => {
				try{
					// fetching data from the backend
				
					const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						body: JSON.stringify(formData)
					})
					const data = await resp.json()
					setStore({ user: data.user, token: data.token })
					localStorage.setItem('token', data.token)
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			register: async (formData) => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						body: JSON.stringify(formData)
					})
					const data = await resp.json()
					setStore({ user: data.user, token: data.token })
					localStorage.setItem('token', data.token)
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;