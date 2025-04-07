import React, { useState, useEffect } from "react";
import "./css/Home.css";
import { useNavigate, useParams } from "react-router-dom";

const Home = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [lists, setLists] = useState([]);
    const [newList, setNewList] = useState({
        title: "",
        words: [
            { term: "", definition: "" },
            { term: "", definition: "" }
        ],
    });

    const navigate = useNavigate();
    const { userId } = useParams(); // ⬅️ récupère depuis l'URL

    useEffect(() => {
        fetch(`https://turboquizz.onrender.com/api/users/${userId}/lists`)
            .then((response) => response.json())
            .then((data) => setLists(data))
            .catch((error) => console.error("Erreur lors du chargement des listes", error));
    }, [userId]);

    const handleListClick = (id) => {
        navigate(`/user/${userId}/list/${id}`);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleChange = (e) => {
        setNewList({ ...newList, title: e.target.value });
    };

    const handleAddWord = () => {
        setNewList({
            ...newList,
            words: [...newList.words, { term: "", definition: "" }],
        });
    };

    const handleWordChange = (index, e) => {
        const { name, value } = e.target;
        const updatedWords = [...newList.words];
        updatedWords[index][name] = value;
        setNewList({ ...newList, words: updatedWords });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`https://turboquizz.onrender.com/api/users/${userId}/lists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newList),
        })
            .then((res) => res.json())
            .then((data) => {
                setLists([...lists, data]);
                setShowPopup(false);
                setNewList({
                    title: "",
                    words: [
                        { term: "", definition: "" },
                        { term: "", definition: "" }
                    ]
                });
            })
            .catch((error) => console.error("Erreur ajout liste:", error));
    };

    return (
        <div className="lists-container">
            <div>
                <div className="titleHome">Lists :</div>
                <button className="add-button" onClick={togglePopup}>
                    <ion-icon name="add-circle-outline" size="large"></ion-icon>
                    Add list
                </button>
            </div>
            <div className="lists-grid">
                {lists.map((list) => (
                    <div
                        key={list.id}
                        className="list-card"
                        onClick={() => handleListClick(list.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <h3>{list.title}</h3>
                        <p>{list.words.length} termes</p>
                    </div>
                ))}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Create a list</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={newList.title}
                                onChange={handleChange}
                                required
                            />
                            {newList.words.map((word, index) => (
                                <div key={index} className="word-card">
                                    <input
                                        type="text"
                                        name="term"
                                        placeholder="Term"
                                        value={word.term}
                                        onChange={(e) => handleWordChange(index, e)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="definition"
                                        placeholder="Definition"
                                        value={word.definition}
                                        onChange={(e) => handleWordChange(index, e)}
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddWord}
                                className="add-word-button"
                            >
                                <ion-icon name="add-outline"></ion-icon>
                            </button>
                            <div className="popup-buttons">
                                <button type="submit" className="save-button">
                                    Save
                                </button>
                                <button type="button" className="cancel-button" onClick={togglePopup}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
