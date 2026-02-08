import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountries } from "../services/api";
import {
  generateFlagQuestions,
  generateCapitalQuestions,
  generateRegionQuestions,
  getScores,
  updateScore,
  type QuizQuestion,
} from "../services/quiz";

type QuizMode = "menu" | "flag" | "capital" | "region" | "results";

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>("menu");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scores, setScores] = useState(getScores());
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    setScores(getScores());
  }, [mode]);

  const startQuiz = async (quizType: "flag" | "capital" | "region") => {
    setIsLoading(true);
    try {
      const countries = await getAllCountries();
      let quizQuestions: QuizQuestion[] = [];

      switch (quizType) {
        case "flag":
          quizQuestions = generateFlagQuestions(countries, questionCount);
          break;
        case "capital":
          quizQuestions = generateCapitalQuestions(countries, questionCount);
          break;
        case "region":
          quizQuestions = generateRegionQuestions(countries, questionCount);
          break;
      }

      setQuestions(quizQuestions);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setMode(quizType);
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const quizTypeMap = {
      flag: "flagQuiz" as const,
      capital: "capitalQuiz" as const,
      region: "regionQuiz" as const,
    };

    if (mode !== "menu" && mode !== "results") {
      updateScore(quizTypeMap[mode], score, questions.length);
      setScores(getScores());
    }
    setMode("results");
  };

  const resetQuiz = () => {
    setMode("menu");
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (isLoading) {
    return (
      <main>
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </main>
    );
  }

  if (mode === "menu") {
    return (
      <main>
        <div className="container">
          <div className="quiz-menu">
            <h2>Quiz Mode</h2>
            <p className="quiz-subtitle">Test your geography knowledge!</p>

            <div className="quiz-settings">
              <label htmlFor="question-count">Number of Questions:</label>
              <select
                id="question-count"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div className="quiz-cards">
              <div className="quiz-card">
                <h3>Guess the Country</h3>
                <p>Identify countries by their flags</p>
                <div className="quiz-score">
                  {scores.flagQuiz.total > 0
                    ? `High Score: ${scores.flagQuiz.score}/${scores.flagQuiz.total} (${Math.round((scores.flagQuiz.score / scores.flagQuiz.total) * 100)}%)`
                    : "No scores yet"}
                </div>
                <button
                  className="quiz-start-btn"
                  onClick={() => startQuiz("flag")}>
                  Start Quiz
                </button>
              </div>

              <div className="quiz-card">
                <h3>Guess the Capital</h3>
                <p>Match countries with their capitals</p>
                <div className="quiz-score">
                  {scores.capitalQuiz.total > 0
                    ? `High Score: ${scores.capitalQuiz.score}/${scores.capitalQuiz.total} (${Math.round((scores.capitalQuiz.score / scores.capitalQuiz.total) * 100)}%)`
                    : "No scores yet"}
                </div>
                <button
                  className="quiz-start-btn"
                  onClick={() => startQuiz("capital")}>
                  Start Quiz
                </button>
              </div>

              <div className="quiz-card">
                <h3>Match the Region</h3>
                <p>Identify which region each country belongs to</p>
                <div className="quiz-score">
                  {scores.regionQuiz.total > 0
                    ? `High Score: ${scores.regionQuiz.score}/${scores.regionQuiz.total} (${Math.round((scores.regionQuiz.score / scores.regionQuiz.total) * 100)}%)`
                    : "No scores yet"}
                </div>
                <button
                  className="quiz-start-btn"
                  onClick={() => startQuiz("region")}>
                  Start Quiz
                </button>
              </div>
            </div>

            <button className="back-to-browse" onClick={() => navigate("/")}>
              ← Back to Browse
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (mode === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    const message =
      percentage === 100
        ? "Perfect!"
        : percentage >= 70
          ? "Great job!"
          : percentage >= 50
            ? "Good effort!"
            : "Keep practicing!";

    return (
      <main>
        <div className="container">
          <div className="quiz-results">
            <h2>Quiz Complete!</h2>
            <div className="results-score">
              <div className="score-display">
                {score}/{questions.length}
              </div>
              <div className="score-percentage">{percentage}%</div>
              <div className="score-message">{message}</div>
            </div>
            <div className="results-actions">
              <button className="quiz-start-btn" onClick={resetQuiz}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main>
      <div className="container">
        <div className="quiz-container">
          <div className="quiz-header">
            <div className="quiz-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-text">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            <div className="quiz-score-display">Score: {score}</div>
          </div>

          <div className="quiz-question">
            {question.type === "flag" && (
              <>
                <div className="question-flag">
                  <img src={question.country.flags.png} alt="Country flag" />
                </div>
                <h3>Which country does this flag belong to?</h3>
              </>
            )}

            {question.type === "capital" && (
              <>
                <h3>What is the capital of {question.country.name.common}?</h3>
                <div className="question-flag-small">
                  <img
                    src={question.country.flags.png}
                    alt={question.country.name.common}
                  />
                </div>
              </>
            )}

            {question.type === "region" && (
              <>
                <h3>Which region is {question.country.name.common} in?</h3>
                <div className="question-flag-small">
                  <img
                    src={question.country.flags.png}
                    alt={question.country.name.common}
                  />
                </div>
              </>
            )}

            <div className="quiz-options">
              {question.options.map((option) => {
                const isCorrect = option === question.correctAnswer;
                const isSelected = option === selectedAnswer;
                const showResult = isAnswered;

                let className = "quiz-option";
                if (showResult && isCorrect) className += " correct";
                if (showResult && isSelected && !isCorrect)
                  className += " incorrect";
                if (isSelected && !showResult) className += " selected";

                return (
                  <button
                    key={option}
                    className={className}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}>
                    {option}
                    {showResult && isCorrect && (
                      <span className="option-icon">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="option-icon">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <button className="quiz-next-btn" onClick={nextQuestion}>
                {currentQuestion < questions.length - 1
                  ? "Next Question →"
                  : "View Results"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
