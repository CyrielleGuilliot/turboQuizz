import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./css/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://turboquizz.onrender.com/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();
            if (data.success) {
                const userId = data.userId;
                localStorage.setItem("userId", userId);
                navigate(`/user/${userId}/home`);
            } else {
                setError("Username or password incorrect");
            }
        } catch (err) {
            console.error("Erreur lors de la tentative de connexion :", err);
            setError("Erreur de connexion au serveur");
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log in</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
