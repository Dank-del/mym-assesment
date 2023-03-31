import React, {FormEvent, useState} from 'react';
import Alert from "./components/Alert";

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<any>({});
    const [alert, setAlert] = useState<any>(null);

    function onInputChange(e: any) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function onSubmit(e: any) {
        e.preventDefault();
        console.log(formData);
        if (formData.password !== formData.password_confirm) {
            setAlert("Passwords do not match");
            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/v1/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then((response) => {
            console.log(response);
            if (response.status === 200 || response.status === 201) {
                setAlert("SignUp Successful");
            } else {
                response.json().then((data) => setAlert("SignUp Failed\n" + data.detail));
                // setAlert("SignUp Failed\n" + data.detail);
            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-mono">Sign Up</h1>
            <div className="mt-3">{alert && <Alert text={alert} />}</div>
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
                        <span className="label-text">Your Name</span>
                    </label>
                    <label className="input-group">
                        <span>Name</span>
                        <input name="name" onChange={onInputChange} required type="text" placeholder="John Doe"
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
                <div>
                    <label className="label">
                        <span className="label-text">Confirm your password</span>
                    </label>
                    <label className="input-group">
                        <span>Confirm</span>
                        <input name="password_confirm" onChange={onInputChange} required type="password" placeholder="John Doe"
                               className="input input-bordered w-full"/>
                    </label>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp;