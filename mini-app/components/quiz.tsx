"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Option {
  text: string;
  animal: Animal;
  isCorrect: boolean;
}

interface Question {
  text: string;
  options: Option[];
}

const animals: Animal[] = ["cat", "dog", "fox", "hamster", "horse"];

const rawQuestions: Question[] = [
  {
    text: "What type of animal do you prefer for a pet?",
    options: [
      { text: "Cat", animal: "cat", isCorrect: true },
      { text: "Dog", animal: "dog", isCorrect: false },
      { text: "Fox", animal: "fox", isCorrect: false },
      { text: "Hamster", animal: "hamster", isCorrect: false },
      { text: "Horse", animal: "horse", isCorrect: false },
    ],
  },
  {
    text: "Which animal do you think is the most independent?",
    options: [
      { text: "Cat", animal: "cat", isCorrect: true },
      { text: "Dog", animal: "dog", isCorrect: false },
      { text: "Fox", animal: "fox", isCorrect: false },
      { text: "Hamster", animal: "hamster", isCorrect: false },
      { text: "Horse", animal: "horse", isCorrect: false },
    ],
  },
  {
    text: "Which animal would you choose for a quick getaway?",
    options: [
      { text: "Cat", animal: "cat", isCorrect: false },
      { text: "Dog", animal: "dog", isCorrect: false },
      { text: "Fox", animal: "fox", isCorrect: true },
      { text: "Hamster", animal: "hamster", isCorrect: false },
      { text: "Horse", animal: "horse", isCorrect: false },
    ],
  },
  {
    text: "Which animal do you think is the most energetic?",
    options: [
      { text: "Cat", animal: "cat", isCorrect: false },
      { text: "Dog", animal: "dog", isCorrect: true },
      { text: "Fox", animal: "fox", isCorrect: false },
      { text: "Hamster", animal: "hamster", isCorrect: false },
      { text: "Horse", animal: "horse", isCorrect: false },
    ],
  },
  {
    text: "Which animal would you prefer for a long ride?",
    options: [
      { text: "Cat", animal: "cat", isCorrect: false },
      { text: "Dog", animal: "dog", isCorrect: false },
      { text: "Fox", animal: "fox", isCorrect: false },
      { text: "Hamster", animal: "hamster", isCorrect: false },
      { text: "Horse", animal: "horse", isCorrect: true },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [animalCounts, setAnimalCounts] = useState<Record<Animal, number>>({
    cat: 0,
    dog: 0,
    fox: 0,
    hamster: 0,
    horse: 0,
  });
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const shuffled = shuffleArray(rawQuestions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(shuffled);
  }, []);

  const handleOptionSelect = (option: Option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      setAnimalCounts((prev) => ({
        ...prev,
        [option.animal]: prev[option.animal] + 1,
      }));
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect!");
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRetake = () => {
    const shuffled = shuffleArray(rawQuestions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnimalCounts({
      cat: 0,
      dog: 0,
      fox: 0,
      hamster: 0,
      horse: 0,
    });
    setShowResult(false);
    setSelectedOption(null);
    setFeedback("");
  };

  const getFinalAnimal = (): Animal => {
    const max = Math.max(...Object.values(animalCounts));
    const candidates = Object.entries(animalCounts)
      .filter(([, v]) => v === max)
      .map(([k]) => k as Animal);
    return candidates[0];
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    const finalAnimal = getFinalAnimal();
    return (
      <Card className="w-full max-w-md p-4">
        <h2 className="text-xl font-semibold mb-4">Your Animal Match</h2>
        <img
          src={`/${finalAnimal}.png`}
          alt={finalAnimal}
          width={512}
          height={512}
          className="mx-auto mb-4"
        />
        <p className="mb-2">
          You scored {score} out of {questions.length} points.
        </p>
        <p className="mb-4">
          You are most similar to a {finalAnimal}!
        </p>
        <Share
          text={`I scored ${score} on the Animal Quiz! Check it out: ${url}`}
        />
        <Button variant="outline" onClick={handleRetake} className="mt-4">
          Retake Quiz
        </Button>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-md p-4">
      <Progress value={progress} className="mb-4" />
      <h3 className="text-lg font-medium mb-2">
        Question {currentIndex + 1} of {questions.length}
      </h3>
      <p className="mb-4">{currentQuestion.text}</p>
      <div className="flex flex-col gap-2">
        {currentQuestion.options.map((opt) => (
          <Button
            key={opt.text}
            variant={selectedOption ? (opt === selectedOption ? "default" : "outline") : "outline"}
            onClick={() => handleOptionSelect(opt)}
            disabled={!!selectedOption}
          >
            {opt.text}
          </Button>
        ))}
      </div>
      {feedback && <p className="mt-2">{feedback}</p>}
      {selectedOption && (
        <Button variant="primary" onClick={handleNext} className="mt-4">
          {currentIndex + 1 < questions.length ? "Next" : "See Result"}
        </Button>
      )}
    </Card>
  );
}
