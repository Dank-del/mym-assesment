import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUp from "./SignUp";
import Navbar from "./components/Navbar";
import SignIn from "./SignIn";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                </Routes>
            </Router>
        </QueryClientProvider>
    </React.StrictMode>
)
