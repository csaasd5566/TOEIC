// pages/index.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as Papa from 'papaparse';

interface VocabItem {
  chapter: string;
  word: string;
  meaning: string;
}

export default function Home() {
  const [chapters, setChapters] = useState<{ [key: string]: VocabItem[] }>({});

  useEffect(() => {
    fetch('/toeic_vocab_en_columns.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<VocabItem>(text, {
          header: true,
          skipEmptyLines: true,
        });
        const grouped: { [key: string]: VocabItem[] } = {};
        result.data.forEach((item) => {
          if (!grouped[item.chapter]) grouped[item.chapter] = [];
          grouped[item.chapter].push(item);
        });
        setChapters(grouped);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">TOEIC 單字章節選單</h1>

      <div className="text-center mb-6">
        <Link
          href="/quiz"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          挑戰全單字隨機 50 題測驗
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(chapters).map(([title], index) => (
          <li key={index} className="border rounded p-4 shadow hover:shadow-md">
            <p className="font-semibold">📘 {title}</p>
            <Link href={`/chapter/${index + 1}`} className="text-blue-600 underline block mt-2">
              查看單字
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
