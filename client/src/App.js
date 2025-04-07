import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import {HashRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";
import Cards from "./pages/Cards";
import Login from "./pages/Login";
import Learn from "./pages/Learn";

function App() {
    return (
        <HashRouter basename="/turboQuizz">
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/:userId/home" element={<Home />} />
                <Route path="/user/:userId/list/:id" element={<List />} />
                <Route path="/user/:userId/list/:id/cards" element={<Cards />} />
                <Route path="/user/:userId/list/:id/learn" element={<Learn />} />
            </Routes>

        </HashRouter>
    );
}

export default App;
