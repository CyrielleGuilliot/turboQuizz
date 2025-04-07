import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from 'react-bootstrap';
import "./css/Cards.css";

const Cards = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [list, setList] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flippedCards, setFlippedCards] = useState({});
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        fetch(`https://turboquizz.onrender.com/api/users/${userId}/lists`)
            .then((response) => response.json())
            .then((data) => {
                const foundList = data.find((l) => l.id === parseInt(id));
                setList(foundList);
            })
            .catch((error) => console.error("Erreur de chargement de la liste", error));
    }, [id]);

    const handleFlip = (index) => {
        setFlippedCards((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleAnswer = (isCorrect) => {
        if (currentIndex < list.words.length) {
            if (isCorrect && correctCount < list.words.length) {
                setCorrectCount(correctCount + 1);
            } else if (!isCorrect && incorrectCount < list.words.length) {
                setIncorrectCount(incorrectCount + 1);
            }

            if (currentIndex < list.words.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        }
    };

    if (!list) return <p>Loading...</p>;

    const word = list.words[currentIndex];
    const isFlipped = flippedCards[currentIndex];

    return (
        <div className="card-container">
            <button
                className="exit-button"
                onClick={() => {
                    const userId = localStorage.getItem("userId");
                    navigate(`/user/${userId}/list/${id}`);
                }}
            >
                <i className="bi bi-x-lg"></i>
            </button>

            <div className="progress-counter">
                {currentIndex + 1}/{list.words.length}
            </div>

            <div className="score-container">
                <div className="score-circle incorrect-score">
                    <span>{incorrectCount}</span>
                </div>
                <div className="score-circle correct-score">
                    <span>{correctCount}</span>
                </div>
            </div>

            <div className="carousel-item-content">
                <div className="flip-card" onClick={() => handleFlip(currentIndex)}>
                    <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
                        <div className="flip-card-front">
                            <Card className="custom-card">
                                <Card.Body className="d-flex justify-content-center align-items-center">
                                    <h3 className="term-text">{word.term}</h3>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className="flip-card-back">
                            <Card className="custom-card back">
                                <Card.Body className="d-flex justify-content-center align-items-center">
                                    <p className="definition-text">{word.definition}</p>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>


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
