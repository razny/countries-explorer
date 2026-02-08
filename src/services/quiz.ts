import type { Country } from "./api";

export interface QuizScore {
  flagQuiz: { score: number; total: number };
  capitalQuiz: { score: number; total: number };
  regionQuiz: { score: number; total: number };
  lastPlayed: string;
}

export interface QuizQuestion {
  type: "flag" | "capital" | "region";
  country: Country;
  options: string[];
  correctAnswer: string;
}

const STORAGE_KEY = "countries-quiz-scores";

export function getScores(): QuizScore {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    flagQuiz: { score: 0, total: 0 },
    capitalQuiz: { score: 0, total: 0 },
    regionQuiz: { score: 0, total: 0 },
    lastPlayed: new Date().toISOString(),
  };
}

export function updateScore(
  quizType: keyof Omit<QuizScore, "lastPlayed">,
  score: number,
  total: number,
): void {
  const scores = getScores();
  const currentPercentage =
    scores[quizType].total > 0
      ? (scores[quizType].score / scores[quizType].total) * 100
      : 0;
  const newPercentage = (score / total) * 100;

  if (newPercentage > currentPercentage) {
    scores[quizType] = { score, total };
  }
  scores.lastPlayed = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function generateFlagQuestions(
  countries: Country[],
  count: number = 10,
): QuizQuestion[] {
  const shuffled = [...countries].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((country) => {
    const options = getRandomOptions(countries, country.name.common, 4);
    return {
      type: "flag",
      country,
      options,
      correctAnswer: country.name.common,
    };
  });
}

export function generateCapitalQuestions(
  countries: Country[],
  count: number = 10,
): QuizQuestion[] {
  const withCapitals = countries.filter(
    (c) => c.capital && c.capital.length > 0,
  );
  const shuffled = [...withCapitals].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((country) => {
    const correctCapital = country.capital![0];
    const options = getRandomCapitalOptions(withCapitals, correctCapital, 4);
    return {
      type: "capital",
      country,
      options,
      correctAnswer: correctCapital,
    };
  });
}

export function generateRegionQuestions(
  countries: Country[],
  count: number = 10,
): QuizQuestion[] {
  const shuffled = [...countries].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  const regions = [
    "Africa",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctic",
  ];

  return selected.map((country) => {
    return {
      type: "region",
      country,
      options: [...regions].sort(() => Math.random() - 0.5),
      correctAnswer: country.region,
    };
  });
}

function getRandomOptions(
  countries: Country[],
  correctAnswer: string,
  count: number,
): string[] {
  const options = new Set<string>([correctAnswer]);
  const available = countries.filter((c) => c.name.common !== correctAnswer);

  while (options.size < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    options.add(available[randomIndex].name.common);
    available.splice(randomIndex, 1);
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

function getRandomCapitalOptions(
  countries: Country[],
  correctAnswer: string,
  count: number,
): string[] {
  const options = new Set<string>([correctAnswer]);
  const available = countries.filter(
    (c) => c.capital && c.capital[0] !== correctAnswer,
  );

  while (options.size < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    options.add(available[randomIndex].capital![0]);
    available.splice(randomIndex, 1);
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}
