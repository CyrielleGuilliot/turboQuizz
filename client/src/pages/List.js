import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel, Card } from 'react-bootstrap';
import "./css/List.css";

const List = () => {
    const { id, userId } = useParams(); // récupère les paramètres d'URL
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [flippedCards, setFlippedCards] = useState({});

    useEffect(() => {
        const uid = userId || localStorage.getItem("userId"); // fallback si pas dans l'URL
        if (!uid) return;

        fetch(`http://localhost:5000/api/users/${uid}/lists`)
            .then((response) => response.json())
            .then((data) => {
                const foundList = data.find((l) => l.id === parseInt(id));
                setList(foundList);
            })
            .catch((error) =>
                console.error("Erreur de chargement de la liste", error)
            );
    }, [id, userId]);

    const handleFlip = (index) => {
        setFlippedCards((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (!list) return <p>Chargement...</p>;

    return (
        <div className="list-container">
            <button className="back-button" onClick={() => navigate(`/user/${userId}/home`)}>
                <i className="bi bi-arrow-left"></i>
            </button>

            <Carousel>
                {list.words.map((word, index) => (
                    <Carousel.Item key={index}>
                        <div className="carousel-item-content">
                            <div
                                className={`flip-card ${flippedCards[index] ? "flipped" : ""}`}
                                onClick={() => handleFlip(index)}
                            >
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
                    </Carousel.Item>
                ))}
            </Carousel>

            <div className="button-group">
                <button className="cards-button" onClick={() => navigate(`/user/${userId}/list/${id}/cards`)}>
                    <i className="bi bi-front"></i>
                    Cards
                </button>

                <button className="cards-button" onClick={() => navigate(`/user/${userId}/list/${id}/learn`)}>
                    <i className="bi bi-graph-up-arrow"></i>
                    Learn
                </button>
            </div>
        </div>
    );
};

export default List;
