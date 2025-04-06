import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/Cards.css";

const Cards = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // États
    const [list, setList] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);

    // Récupération des mots depuis l'API
    useEffect(() => {
        const userId = localStorage.getItem("userId");

        fetch(`http://localhost:5000/api/users/${userId}/lists`)

            .then((response) => response.json())
            .then((data) => {
                const foundList = data.find((l) => l.id === parseInt(id));
                setList(foundList);
            })
            .catch((error) => console.error("Erreur de chargement de la liste", error));
    }, [id]);

    if (!list) return <p>Chargement...</p>;
    const words = list.words;

    // Fonction pour retourner la carte
    const handleFlip = () => {
        setFlipped(!flipped);
    };

    // Fonction pour gérer la réponse (correcte ou incorrecte)
    const handleAnswer = (isCorrect) => {
        if (currentIndex < words.length) {
            if (isCorrect && correctCount < words.length) {
                setCorrectCount(correctCount + 1);
            } else if (!isCorrect && incorrectCount < words.length) {
                setIncorrectCount(incorrectCount + 1);
            }

            // Passer à la carte suivante si on n'est pas à la dernière
            if (currentIndex < words.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setFlipped(false);
            }
        }
    };


    return (
        <div className="card-container">
            {/* Bouton de sortie */}
            <button
                className="exit-button"
                onClick={() => {
                    const userId = localStorage.getItem("userId");
                    navigate(`/user/${userId}/list/${id}`);
                }}>
                <i className="bi bi-x-lg"></i>
            </button>


            {/* Compteur de progression */}
            <div className="progress-counter">{currentIndex + 1}/{words.length}</div>

            {/* Compteurs de réponses */}
            <div className="score-container">
                <div className="score-circle incorrect-score">
                    <span>{incorrectCount}</span>
                </div>
                <div className="score-circle correct-score">
                    <span>{correctCount}</span>
                </div>
            </div>


            {/* Carte retournable */}
            <div className={`flip-card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
                <div className="flip-card-inner">
                    {/* Face avant */}
                    <div className="flip-card-front">
                        <div className="card-content">{words[currentIndex].term}</div>
                    </div>
                    {/* Face arrière */}
                    <div className="flip-card-back">
                        <div className="card-content">{words[currentIndex].definition}</div>
                    </div>
                </div>
            </div>

            {/* Boutons de validation */}
            <div className="button2-group">
                <button className="incorrect-button" onClick={() => handleAnswer(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>
                <button className="correct-button" onClick={() => handleAnswer(true)}>
                    <i className="bi bi-check-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default Cards;
