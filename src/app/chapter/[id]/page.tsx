"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import * as Papa from 'papaparse';


interface VocabItem {
  chapter: string;
  word: string;
  meaning: string;
}

export default function ChapterPage() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const [chapterTitle, setChapterTitle] = useState('');
  const [words, setWords] = useState<VocabItem[]>([]);

  useEffect(() => {
    fetch('/toeic_vocab_en_columns.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<VocabItem>(text, {
          header: true,
          skipEmptyLines: true,
        });
        const chapters = Array.from(new Set(result.data.map((item) => item.chapter)));
        const currentChapter = chapters[id - 1];
        const filtered = result.data.filter((item) => item.chapter === currentChapter);
        setChapterTitle(currentChapter);
        setWords(filtered);
      });
  }, [id]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{chapterTitle}</h1>
      <ul className="space-y-2">
        {words.map((item, i) => (
          <li key={i} className="border p-3 rounded shadow-sm">
            <span className="font-semibold">{item.word}</span> - {item.meaning}
          </li>
        ))}
      </ul>
    </div>
  );
}
