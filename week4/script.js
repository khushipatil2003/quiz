        let questions = [
            {
                type: "multiple-choice",
                question: "What is the capital of Italy?",
                options: ["Madrid", "Paris", "Rome", "Berlin"],
                answer: "Rome"
            },
            {
                type: "multiple-choice",
                question: "Which planet is known as the Red Planet?",
                options: ["Mars", "Venus", "Jupiter", "Saturn"],
                answer: "Mars"
            },
            {
                type: "true-false",
                question: "The Great Wall of China is visible from space.",
                answer: true
            },
            {
                type: "true-false",
                question: "The Nile River is the longest river in the world.",
                answer: true
            },
            {
                type: "open-ended",
                question: "Name a famous painting by Leonardo da Vinci.",
                answer: "Mona Lisa",
                score: 2
            },
            {
                type: "open-ended",
                question: "What is the chemical symbol for gold?",
                answer: "Au",
                score: 2
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let wrongAnswers = 0;
        let userAnswers = new Array(questions.length).fill('');
        let users = [];

        function startQuiz() {
            const username = document.getElementById('username').value;
            if (username.trim() === '') {
                alert('Please enter your name.');
                return;
            }

            const userIndex = users.findIndex(user => user.name === username);
            if (userIndex !== -1) {
                alert('User already exists. Please use a different name.');
                return;
            }

            document.getElementById('name-input').style.display = 'none';
            document.getElementById('quiz').style.display = 'block';
            document.getElementById('quiz-label').style.display = 'none';
            document.getElementById('greet').textContent = `Hello, ${username}!`;

            const user = {
                name: username,
                answers: new Array(questions.length).fill(''),
                score: 0,
                wrongAnswers: 0
            };

            users.push(user);

            displayQuestion();
        }

function selectAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (selectedOption) {
        const userAnswer = selectedOption.value;
        userAnswers[currentQuestion] = userAnswer;

        const correctAnswerElement = document.getElementById('correct-answer');
        correctAnswerElement.textContent = `The correct answer is: ${questions[currentQuestion].answer}`;
        correctAnswerElement.style.display = 'block';

        if (questions[currentQuestion].type !== "open-ended") {
            if (userAnswer === questions[currentQuestion].answer.toString()) {
                score++;
                selectedOption.parentElement.classList.add('correct-answer');
            } else {
                wrongAnswers++;
                selectedOption.parentElement.classList.add('incorrect-answer');
            }
        } else {
            // For open-ended questions, check if the answer is correct
            if (userAnswer.toLowerCase() === questions[currentQuestion].answer.toLowerCase()) {
                score += questions[currentQuestion].score; // Add score for open-ended question
                selectedOption.parentElement.classList.add('correct-answer');
            } else {
                wrongAnswers++;
                selectedOption.parentElement.classList.add('incorrect-answer');
            }
        }
    }
}


        function nextQuestion() {
            selectAnswer();
            currentQuestion++;
            document.getElementById('correct-answer').style.display = 'none';
            if (currentQuestion < questions.length) {
                displayQuestion();
            } else {
                document.getElementById('next').style.display = 'none';
                document.getElementById('submit').style.display = 'inline';
            }
        }

        function submitQuiz(event) {
            event.preventDefault();
            selectAnswer();

            const username = document.getElementById('username').value;
            const user = users.find(user => user.name === username);

            user.score = score;

            const resultElement = document.getElementById('result');
            let message = '';

            message += `Your score is ${user.score}.<br>`;

            if (user.score === 0) {
                message += "You didn't get any correct answers. ";
            } else if (user.score === 1) {
                message += `You got 1 correct answer. `;
            } else {
                message += `You got ${user.score} correct answers. `;
            }

            if (user.wrongAnswers > 0) {
                message += `${user.wrongAnswers} open-ended questions were not answered correctly. `;
            }

            resultElement.innerHTML = message;
            resultElement.style.display = 'block';

            displayCorrectAnswers(user);

            const correctAnswersElement = document.getElementById('correct-answers');
            correctAnswersElement.style.display = 'block';

            document.getElementById('quiz').style.display = 'none';

            // Save users to localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Check if 15 questions have been answered, and clear leaderboard if condition is met
            if (currentQuestion === 14) {
                localStorage.removeItem('users'); // Clear leaderboard data
            }
        }

        function displayQuestion() {
            const questionElement = document.getElementById('question');
            const optionsElement = document.getElementById('options');
            const submitButton = document.getElementById('submit');
            const nextButton = document.getElementById('next');

            questionElement.textContent = questions[currentQuestion].question;
            optionsElement.innerHTML = '';

            if (questions[currentQuestion].type === "multiple-choice") {
                questions[currentQuestion].options.forEach(option => {
                    const label = document.createElement('label');
                    label.innerHTML = `
                        <input type="radio" name="option" value="${option}">
                        ${option}<br>
                    `;
                    optionsElement.appendChild(label);
                });
            } else if (questions[currentQuestion].type === "true-false") {
                const trueLabel = document.createElement('label');
                trueLabel.innerHTML = `
                    <input type="radio" name="option" value="true">
                    True<br>
                `;
                optionsElement.appendChild(trueLabel);

                const falseLabel = document.createElement('label');
                falseLabel.innerHTML = `
                    <input type="radio" name="option" value="false">
                    False<br>
                `;
                optionsElement.appendChild(falseLabel);
            } else if (questions[currentQuestion].type === "open-ended") {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'option';
                optionsElement.appendChild(input);

                // Add an event listener to the input field to update userAnswers
                input.addEventListener('input', function() {
                    userAnswers[currentQuestion] = this.value;
                });
            }

            if (currentQuestion === questions.length - 1) {
                submitButton.style.display = 'inline';
                nextButton.style.display = 'none';
            } else {
                submitButton.style.display = 'none';
                nextButton.style.display = 'inline';
            }
        }

function displayCorrectAnswers(user) {
    const correctAnswersElement = document.getElementById('correct-answers');
    correctAnswersElement.innerHTML = '<h2>Correct Answers</h2>';

    let totalScore = 0;

    questions.forEach((question, index) => {
        const correctAnswer = question.answer;
        const userAnswer = userAnswers[index] || 'Not answered';

        correctAnswersElement.innerHTML += `
            <p>Question ${index + 1}: ${question.question}</p>
            <p>Correct Answer: ${correctAnswer}</p>
            <p>Your Answer: ${userAnswer}</p>
            <br>
        `;

        if (userAnswer === correctAnswer.toString()) {
            if (questions[index].type === "open-ended") {
                totalScore += questions[index].score;
            } else {
                totalScore++;
            }
        }
    });

    const scoreElement = document.createElement('p');
    scoreElement.innerHTML = `Total Score: ${totalScore}`;
    correctAnswersElement.insertBefore(scoreElement, correctAnswersElement.firstChild);

    correctAnswersElement.style.display = 'block';
}


        function displayLeaderboard() {
            window.location.href = 'leaderboard.html';
        }

        document.addEventListener('DOMContentLoaded', function() {
            const storedUsers = JSON.parse(localStorage.getItem('users'));

            if (storedUsers) {
                users = storedUsers;
            }
        });