import {Fragment} from "react";
import useEffectiveUser from "./hooks/useEffectiveUser";
import {useQuery} from "react-query";

interface INASAImgOfTheDay {
    date: string
    explanation: string
    hdurl: string
    media_type: string
    service_version: string
    title: string
    url: string
}


function App() {
    const [user] = useEffectiveUser();
    const imageQuery = useQuery<INASAImgOfTheDay>("img", {
        queryFn: () =>
            fetch(`https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}`).then(res =>
                res.json()
            )
    })

    return (
        <Fragment>
            <div className="flex flex-col items-center justify-center">
                {user ? <div className="h-screen">
                    {imageQuery.isLoading ? <h1 className="text-4xl font-semibold">Loading Today's image</h1> : <div>
                        <div className="hero min-h-screen bg-base-200">
                            <div className="hero-content flex-col lg:flex-row-reverse">
                                <img src={
                                    // @ts-ignore
                                    imageQuery.data.hdurl
                                } className="max-w-sm rounded-lg shadow-2xl"/>
                                <div>
                                    <h1 className="text-5xl font-bold">{
                                        // @ts-ignore
                                        imageQuery.data.title
                                    }</h1>
                                    <p className="py-6">{
                                        // @ts-ignore
                                        imageQuery.data.explanation
                                    }</p>
                                    <div className="flex flex-row space-x-2">
                                        <div className="badge badge-outline">{  // @ts-ignore
                                            imageQuery.data.date
                                        }</div>
                                        <div className="badge badge-outline">
                                            {  // @ts-ignore
                                                imageQuery.data.service_version
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div> : <a href="/signin" className="btn btn-primary mt-12">Login to See today's Image</a>}
            </div>
        </Fragment>
    )
}

export default App
