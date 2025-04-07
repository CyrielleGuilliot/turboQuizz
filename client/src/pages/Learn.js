import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import "./css/Learn.css";

const Learn = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [progress, setProgress] = useState(0);
    const [wordStats, setWordStats] = useState({});
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentExerciseType, setCurrentExerciseType] = useState("QCM");
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const isWordMastered = (stats) => {
        return stats.qcmCorrect >= 2 && stats.inputCorrect >= 2;
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        fetch(`https://turboquizz.onrender.com/api/users/${userId}/lists`)
            .then(response => response.json())
            .then(data => {
                const selectedList = data.find(l => l.id === parseInt(id));
                if (selectedList && selectedList.words.length > 0) {
                    setList(selectedList);
                    initializeWordStats(selectedList.words);
                    generateOptions(selectedList.words[0], selectedList.words);
                } else {
                    console.error("Liste non trouvée ou vide.");
                }
            })
            .catch(error => console.error("Erreur de chargement de la liste", error));
    }, [id]);

    const initializeWordStats = (words) => {
        const stats = {};
        words.forEach((word, index) => {
            stats[index] = {
                qcmCorrect: 0,
                inputCorrect: 0,
                usedRecently: false,
            };
        });
        setWordStats(stats);
    };

    const generateOptions = (word, words) => {
        if (!word || !words) return;

        const correctDefinition = word.definition;
        let incorrectDefs = words
            .map(w => w.definition)
            .filter(def => def !== correctDefinition);

        incorrectDefs = incorrectDefs.sort(() => 0.5 - Math.random()).slice(0, 3);
        const allOptions = [correctDefinition, ...incorrectDefs].sort(() => 0.5 - Math.random());

        setOptions(allOptions);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const selectNextWord = () => {
        if (!list || !list.words || Object.keys(wordStats).length === 0) return;

        const notMasteredIndexes = Object.entries(wordStats)
            .filter(([_, stats]) => !isWordMastered(stats))
            .map(([index]) => index);

        if (notMasteredIndexes.length === 0) {
            setList(null);
            setSessionComplete(true);
            return;
        }

        let availableWords = notMasteredIndexes.filter(i => !wordStats[i].usedRecently);

        if (availableWords.length === 0) {
            notMasteredIndexes.forEach(i => wordStats[i].usedRecently = false);
            availableWords = notMasteredIndexes;
        }

        const nextIndex = availableWords[Math.floor(Math.random() * availableWords.length)];

        wordStats[nextIndex].usedRecently = true;
        setWordStats({...wordStats});
        setCurrentWordIndex(parseInt(nextIndex));

        const nextStats = wordStats[nextIndex];
        if (nextStats.qcmCorrect >= 2) {
            setCurrentExerciseType("Input");
        } else {
            setCurrentExerciseType("QCM");
            generateOptions(list.words[nextIndex], list.words);
        }
    };

    const handleQCMChoice = (selectedDef) => {
        if (!list) return;

        const correctDef = list.words[currentWordIndex].definition;
        const isAnswerCorrect = selectedDef === correctDef;

        setSelectedAnswer(selectedDef);
        setIsCorrect(isAnswerCorrect);

        const updatedStats = {...wordStats};
        const currentStats = updatedStats[currentWordIndex];

        if (isAnswerCorrect) {
            currentStats.qcmCorrect += 1;

            // Vérifie si le mot est maîtrisé
            if (currentStats.qcmCorrect >= 2 && currentStats.inputCorrect >= 2) {
                currentStats.mastered = true;
            }
        }

        setWordStats(updatedStats);
        updateProgress(updatedStats);

        setTimeout(() => {
            selectNextWord();
        }, 1000);
    };

    const handleInputSubmit = () => {
        if (!userInput.trim()) return;

        setHasSubmitted(true);

        const correctDef = list.words[currentWordIndex].definition;
        const isAnswerCorrect = userInput.trim().toLowerCase() === correctDef.toLowerCase();

        setIsCorrect(isAnswerCorrect);

        const updatedStats = {...wordStats};
        const currentStats = updatedStats[currentWordIndex];

        if (isAnswerCorrect) {
            currentStats.inputCorrect += 1;

            if (currentStats.qcmCorrect >= 2 && currentStats.inputCorrect >= 2) {
                currentStats.mastered = true;
            }
        }

        setWordStats(updatedStats);
        updateProgress(updatedStats);

        setTimeout(() => {
            selectNextWord();
            setUserInput("");
            setIsCorrect(null);
            setHasSubmitted(false);
        }, 1000);
    };


    const updateProgress = (updatedStats) => {
        if (!list) return;

        const totalWords = list.words.length;
        const masteredWords = Object.values(updatedStats).filter(stat =>
            stat.qcmCorrect >= 2 && stat.inputCorrect >= 2
        ).length;

        console.log("Progress:", masteredWords, "/", totalWords); // Ajoute ceci pour voir

        const newProgress = (masteredWords / totalWords) * 100;
        setProgress(newProgress);
    };

    if (!list && !sessionComplete) {
        return <p>Loading...</p>;
    }

    if (sessionComplete) {
        return (
            <div className="learn-container">
                <h2>🎉 Congrats !</h2>
                <p>You've mastered all the words on this list.</p>
                <button onClick={() => {
                    const userId = localStorage.getItem("userId");
                    navigate(`/user/${userId}/list/${id}`);}}>
                    Back to the list
                </button>
            </div>
        );
    }

    return (
        <div className="learn-container">
            <button
                className="exit-button"
                onClick={() => {
                    const userId = localStorage.getItem("userId");
                    navigate(`/user/${userId}/list/${id}`);
                }}>
                <i className="bi bi-x-lg"></i>
            </button>

            <h2 className="term">{list.words[currentWordIndex].term}</h2>
            {currentExerciseType === "QCM" ? (
                    <div className="options-container">
                        {options.length > 0 ? (
                            options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-button ${
                                        selectedAnswer
                                            ? option === list.words[currentWordIndex].definition
                                                ? "correct"
                                                : option === selectedAnswer
                                                    ? "incorrect"
                                                    : ""
                                            : ""
                                    }`}
                                    onClick={() => handleQCMChoice(option)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option}
                                    {selectedAnswer === option && (
                                        <i className={`bi ${isCorrect ? "bi-check-lg" : "bi-x"}`}/>
                                    )}
                                </button>
                            ))
                        ) : (
                            <p>Loading of options...</p>
                        )}
                    </div>
                ) : (
                    <div className="input-container">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Écrivez la définition"
                        />
                        <button onClick={handleInputSubmit}>
                            <i className="bi bi-arrow-up-circle-fill"></i>
                        </button>
                        {hasSubmitted && (
                            <p className={isCorrect ? "correct-text" : "incorrect-text"}>
                                {isCorrect
                                    ? "Correct !"
                                    : `Faux, la bonne réponse était : ${list.words[currentWordIndex].definition}`}
                            </p>
                        )}
                    </div>
                )
            }
        </div>
    )
        ;
};

export default Learn;
