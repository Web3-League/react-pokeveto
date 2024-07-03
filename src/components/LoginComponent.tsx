// src/components/LoginComponent.tsx
import React, { useState } from "react";

interface UserData {
    email: string;
    password: string;
}

interface LoginComponentProps {
    handleLogin: (userData: UserData) => Promise<void>;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleLogin({ email, password });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginComponent;
