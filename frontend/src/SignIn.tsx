import React, {useState} from 'react';
import Alert from "./components/Alert";
import {useCookies} from "react-cookie";
import {logout, signInWithGoogle} from "./utils/firebase";
import {useNavigate} from "react-router-dom";

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<any>({});
    const [alert, setAlert] = useState<any>(null);
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    function onInputChange(e: any) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function onSubmit(e: any) {
        e.preventDefault();
        console.log(formData);
        fetch(`${import.meta.env.VITE_API_URL}/v1/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then(async (response) => {
            console.log(response);
            if (response.status === 200 || response.status === 201) {
                setAlert("SignIn Successful");
                response.json().then((data) => setCookie("token", data.data.token))
                await logout();
                navigate("/")
            } else {
                // response.json().then(() => setAlert("SignUp Failed\n"));
                setAlert("SignUp Failed\n")
                return
                // setAlert("SignUp Failed\n" + data.detail);
            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-mono">Sign In</h1>
            <div className="mt-3">{alert && <Alert text={alert}/>}</div>
            <form onSubmit={onSubmit} className="form-control">
                <div>
                    <label className="label">
                        <span className="label-text">Your Email</span>
                    </label>
                    <label className="input-group">
                        <span>Email</span>
                        <input name="email" onChange={onInputChange} required type="email" placeholder="info@site.com"
                               className="input input-bordered w-full"/>
                    </label>
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Your Password</span>
                    </label>
                    <label className="input-group">
                        <span>Password</span>
                        <input name="password" onChange={onInputChange} required type="password" placeholder="password"
                               className="input input-bordered w-full"/>
                    </label>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Sign In</button>
                <button onClick={signInWithGoogle} className="btn btn-primary mt-3">Sign In with Google</button>
            </form>
            <span className="mt-2">No account? <a className="text-primary" href="/signup">Sign Up</a></span>
        </div>
    )
}

export default SignUp;