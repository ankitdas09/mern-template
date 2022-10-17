import { useEffect } from "react";
import axios from "axios";

function App() {
	useEffect(() => {
		const getConnection = async () => {
			const resp = await axios.get("/users");
			console.log(resp);
		};
		getConnection();
	}, []);
	return <div className="App">React</div>;
}

export default App;
