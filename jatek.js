let questions = [

    {
        question: "Milyen híres eszközt alkotott Blaise Pascal?",
        answers: ["Gőzgép", "Szeizmográf", "Nyomdagép", "Mechanikus számológép"],
        correctAnswer: 3
    },
    {
        question: "Milyen tudományágban alkotott jelentős elméleteket Pascal?",
        answers: ["Kémia", "Biológia", "Hidrodinamika", "Asztronómia"],
        correctAnswer: 2
    },
    {
        question: "Pascal milyen híres munkát írt?",
        answers: ["A geometria alapjaid", "Az égbolt mozgása", "A gravitáció törvényei", "Gondolatok (Pensées)"],
        correctAnswer: 3
    },
    {
        question: "Pascal melyik filozófiai fogalommal vált ismertté?",
        answers: ["Pascal háromszög", "Pascal fogadása", "Pascal hidrodinamikája", "Pascal kockája"],
        correctAnswer: 1
    },
    {
        question: "Pascal neve melyik matematikai alakzattal kapcsolatos?",
        answers: ["Pascal háromszög", "Pascal ellipszis", "Pascal spirál", "Pascal síkidom"],
        correctAnswer: 0
    },
    {
        question: "Hány éves volt Pascal, amikor feltalálta a számológépet?",
        answers: ["18", "19", "21", "24"],
        correctAnswer: 0
    },
    {
        question: "Pascal nevéhez melyik fizikai elv kapcsolódik?",
        answers: ["Archimédesz törvénye", "Pascal törvénye", "Newton törvénye", "Boyle törvénye"],
        correctAnswer: 1
    },
    {
        question: "Melyik országban született Blaise Pascal?",
        answers: ["Németország", "Olaszország", "Franciaország", "Spanyolország"],
        correctAnswer: 2
    },
    {
        question: "Mi volt Pascal alapvető érdeklődési területe?",
        answers: ["Politika", "Földrajz", "Matematika", "Irodalom"],
        correctAnswer: 2
    },
    {
        question: " Melyik híres tudományos vita részese volt Pascal?",
        answers: ["A fény természetéről szóló vita Descartes-szal", "A vákuum létezéséről szóló vita", "A bolygók mozgásáról szóló vita Keplerrel", "A differenciálszámítás alapjairól szóló vita Newtonnal"],
        correctAnswer: 1
    },

];

// Duplicates és üres kérdések eltávolítása
questions = removeInvalidQuestions(questions);

let currentQuestionIndex = 0;
let lives = 3;
const maxLives = 3;

function startGame() {
    currentQuestionIndex = 0;
    lives = maxLives; // Reset lives
    shuffleQuestions(questions); // Shuffle questions
    updateLives();
    showQuestion(); // Display the first question
}

function removeInvalidQuestions(array) {
    const uniqueQuestions = [];
    const seenQuestions = new Set();

    array.forEach(questionObj => {
        // Csak akkor adjuk hozzá, ha van kérdés szöveg, válaszok és helyes válasz
        if (
            questionObj.question &&
            Array.isArray(questionObj.answers) &&
            questionObj.answers.length === 4 &&
            questionObj.answers.every(answer => answer.trim() !== "") &&
            questionObj.correctAnswer !== null &&
            questionObj.correctAnswer >= 0 &&
            questionObj.correctAnswer < 4 &&
            !seenQuestions.has(questionObj.question)
        ) {
            uniqueQuestions.push(questionObj);
            seenQuestions.add(questionObj.question);
        }
    });

    return uniqueQuestions;
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        resetGame();
        return;
    }

    const questionElement = document.getElementById("question");
    const questionNumberElement = document.getElementById("questionNumber");
    const answerElements = [
        document.getElementById("answer0"),
        document.getElementById("answer1"),
        document.getElementById("answer2"),
        document.getElementById("answer3"),
    ];
    const imageElement = document.getElementById("questionImage");
    const soundElement = document.getElementById("questionSound");

    const currentQuestion = questions[currentQuestionIndex];

    // Biztonsági ellenőrzés: minden kérdés érvényességét garantáljuk
    if (!currentQuestion || !currentQuestion.question || !currentQuestion.answers) {
        console.error("Érvénytelen kérdés vagy válasz:", currentQuestion);
        return;
    }

    questionElement.innerText = currentQuestion.question;
    questionNumberElement.innerText = `Kérdés ${currentQuestionIndex + 1} / ${questions.length}`;

    // Image kezelés
    if (currentQuestion.image) {
        imageElement.src = currentQuestion.image;
        imageElement.style.display = "block";
    } else {
        imageElement.style.display = "none";
    }

    // Hang kezelés
    if (currentQuestion.sound) {
        soundElement.src = currentQuestion.sound;
        soundElement.style.display = "block";
        soundElement.play();
    } else {
        soundElement.style.display = "none";
        soundElement.pause();
        soundElement.currentTime = 0;
    }

    currentQuestion.answers.forEach((answer, index) => {
        const element = answerElements[index];
        element.innerText = answer;
        element.classList.remove("correct", "incorrect");
        element.style.pointerEvents = "auto";
        element.style.backgroundColor = "#8e6549c6";
        element.style.border = "5px ridge brown";
        element.style.display = "block";

        element.onclick = () => {
            checkAnswer(index);
        };
    });
}

function checkAnswer(selectedAnswerIndex) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const answerElements = [
        document.getElementById("answer0"),
        document.getElementById("answer1"),
        document.getElementById("answer2"),
        document.getElementById("answer3"),
    ];

    answerElements.forEach(element => {
        element.style.pointerEvents = "none";
    });

    if (selectedAnswerIndex === correctAnswer) {
        document.getElementById(`answer${selectedAnswerIndex}`).style.backgroundColor = "limegreen";

        if (currentQuestionIndex === questions.length - 1) {
            endGame(true); // Player wins
        } else {
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 1000);
        }
    } else {
        document.getElementById(`answer${selectedAnswerIndex}`).style.backgroundColor = "red";

        setTimeout(() => {
            lives--;
            updateLives();

            if (lives <= 0) {
                endGame(false); // Player loses
            } else {
                currentQuestionIndex++;
                showQuestion();
            }
        }, 1000);
    }
}

function updateLives() {
    for (let i = 1; i <= maxLives; i++) {
        const lifeElement = document.getElementById(`life${i}`);
        lifeElement.style.visibility = i <= lives ? "visible" : "hidden";
    }
}

function resetGame() {
    currentQuestionIndex = 0;
    lives = maxLives;
    startGame();
}

function endGame(won) {
    if (won) {
        window.location.href = "winner.html";
    } else {
        window.location.href = "loser.html";
    }
}

window.onload = function () {
    updateLives();
    startGame();
};
