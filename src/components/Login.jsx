import React from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebaseConfig';

const Login = () => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        signInWithGoogle()
            .then((result) => {
                const name = result.user.displayName;
                const email = result.user.email;
                const profilePic = result.user.photoURL;
                const uid = result.user.uid;
    
                const user = {name, email, profilePic, uid}
    
                // Convert the user object to a JSON string before storing it
                const userString = JSON.stringify(user);

                localStorage.setItem("user", userString);
                navigate('/', { replace: true });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="Home">
            <button className="sign-in" onClick={handleSignIn}>
                Sign in
            </button>
        </div>
    );
};

export default Login;