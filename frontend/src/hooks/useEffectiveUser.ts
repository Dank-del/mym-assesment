import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../utils/firebase";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";

export default function useEffectiveUser() {
    const [user] = useAuthState(auth)
    const [dataArr, setDataArr] = useState<string[] | null[]>([]);
    const [cookies] = useCookies(['token']);
    useEffect(() => {
        (async () => {
            if (user) {
                setDataArr([user.displayName!, user.email!, user.uid, "google"])
                return
            }
            const resp = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/me?token=${cookies.token}`)
            if (resp.status === 200 || resp.status === 201) {
                const jsn = await resp.json()
                console.log(jsn)
                setDataArr([jsn.data.user.fullName, jsn.data.user.email, jsn.data.user._id, "custom_server"])
            } else {
                setDataArr([null, null, null])
            }
        })();
    }, [user]);

    return dataArr
}