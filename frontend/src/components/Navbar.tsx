import useEffectiveUser from "../hooks/useEffectiveUser";
import {logout} from "../utils/firebase";
import {useCookies} from "react-cookie";

export default function Navbar() {
    const [name] = useEffectiveUser();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    async function onLogout() {
        await logout()
        removeCookie("token")
        window.location.reload();
    }

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        {name ? <li><a>{name}</a></li> : <li><a>Login</a></li>}
                        {name && <li><button onClick={onLogout}>Log Out</button></li>}
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a href="/" className="btn btn-ghost normal-case text-xl">Nasa Daily Image</a>
            </div>
            <div className="navbar-end">
                <h1 className="text-2xl font-semibold">MYM</h1>
            </div>
        </div>
    )
}