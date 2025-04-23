"use client";

import { useEffect, useState } from 'react';
import * as Papa from 'papaparse';

interface VocabItem {
  chapter: string;
  word: string;
  meaning: string;
}

function getRandomSubset<T>(array: T[], count: number): T[] {
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function FullQuizPage() {
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/toeic_vocab_en_columns.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<VocabItem>(text, {
          header: true,
          skipEmptyLines: true,
        });
        const selected = getRandomSubset(result.data, 50);
        setQuestions(selected);
        setAnswers(Array(selected.length).fill(''));
      });
  }, []);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    return questions.reduce((score, q, i) => {
      return score + (answers[i].trim() === q.meaning ? 1 : 0);
    }, 0);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">TOEIC 隨機 50 題測驗</h1>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-medium">{i + 1}. {q.word}</p>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            disabled={submitted}
          />
          {submitted && answers[i].trim() !== q.meaning && (
            <p className="text-red-500 text-sm">正確答案：{q.meaning}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          送出答案
        </button>
      ) : (
        <div className="mt-4 text-lg font-semibold">
          得分：{getScore()} / {questions.length}
        </div>
      )}
    </div>
  );
}
