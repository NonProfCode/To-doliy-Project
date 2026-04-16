'use client';
import Tiptap from '@/app/components/Tiptap'
import { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";

interface JournalEntry {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  dateCreated: string;
  Mood: '1' | '2' | '3' | '4' | '5';
}


export default function Mood_Page() {

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('journals');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
});
  const [activeJournal, setActiveJournal] = useState<JournalEntry | null>(null);
  const [editingJournalId, setEditingJournalId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addJournal = () => {
    const newJournal: JournalEntry = {
      id: Date.now(),
      name: `Journal ${journals.length + 1}`,
      description: '',
      isCompleted: false,
      dateCreated: new Date().toLocaleDateString(),
      Mood: '3',
    };
    setJournals([...journals, newJournal]);
  };

// LOAD
useEffect(() => {
  const saved = localStorage.getItem('journals');
  if (saved) {
    const parsed = JSON.parse(saved);
    setJournals(parsed);
  }
}, []);



// SAVE
useEffect(() => {
  localStorage.setItem('journals', JSON.stringify(journals));
}, [journals]);

const moodMap = {
  '1': '😢',
  '2': '🙁',
  '3': '😐',
  '4': '🙂',
  '5': '😄',
};

  const deleteJournal = (id: number) => {
    if (window.confirm('Are you sure you want to delete this journal?')) {
      setJournals(prev => prev.filter(journal => journal.id !== id));
      if (activeJournal && activeJournal.id === id) {
        setActiveJournal(null);
      }
    }
  };

  const filteredJournals = journals.filter(journal =>
    journal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.dateCreated.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const updateJournal = (id: number, field: keyof JournalEntry, value: JournalEntry[keyof JournalEntry]) => {
   setJournals((prevJournals) =>
  prevJournals.map((journal) =>
    journal.id === id ? { ...journal, [field]: value } : journal
  )
);

    if (activeJournal && activeJournal.id === id) {
      setActiveJournal({ ...activeJournal, [field]: value });
    }
  };

  
  return (
    <>
      <div className='bg-[#F9D965] p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-3'>
  <h1 className="text-2xl font-semibold">Today: Rate your mood</h1>

  

  {activeJournal && (
    <div className="flex gap-2">
      {(['1','2','3','4','5'] as const).map((mood) => (
        <button
          key={mood}
          onClick={() => updateJournal(activeJournal.id, 'Mood', mood)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition
            ${activeJournal.Mood === mood 
              ? 'bg-black text-white scale-110' 
              : 'bg-[#F3C623] hover:bg-[#FCFF58] text-black'}
          `}
        >
          {mood}
        </button>
      ))}
    </div>
  )}
</div>

      <div className='bg-[#F9D965] p-2 rounded-3xl mt-4 grid grid-cols-4 gap-4'>
        <div className="bg-[#FFB22C] rounded-2xl p-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Journal List:</h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search journals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <ul className="space-y-2">
            {filteredJournals.map((journal) => (
              <li key={journal.id} className="flex items-center gap-2 hover:bg-[#FFC857] p-2 rounded-lg transition-colors">
                <div className="flex-1 cursor-pointer" onClick={() => setActiveJournal(journal)}>
                  {editingJournalId === journal.id ? (
                    <input
                      type="text"
                      value={journal.name}
                      onChange={(e) => updateJournal(journal.id, 'name', e.target.value)}
                      onBlur={() => setEditingJournalId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingJournalId(null);
                        if (e.key === 'Escape') setEditingJournalId(null);
                      }}
                      className="border p-1 rounded text-black w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      {journal.name} {moodMap[journal.Mood]}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-green-600 hover:text-green-800 px-2 py-1 rounded text-sm"
                    onClick={() => setEditingJournalId(journal.id)}
                  >
                    <MdEdit/>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded text-sm"
                    onClick={() => deleteJournal(journal.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="btn rounded-full bg-[#F3C623] text-lg sm:text-xl hover:bg-[#FCFF58] border-none text-black shadow-md transition-colors duration-200 mt-4"
            onClick={addJournal}
          >
            <span className="text-xl font-bold">+</span>
            <span className="hidden sm:inline ml-1">Add Journal</span>
          </button>
        </div>

        <div className=" bg-[#FCFF58] col-span-3 p-4 rounded-2xl text-black">
          {activeJournal ? (
            <>
              <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                {activeJournal.dateCreated} {activeJournal.name}
                <span className="text-xl">
                  {moodMap[activeJournal.Mood]}
                </span>
              </h3>
              <Tiptap
                content={activeJournal.description}
                onContentChange={(newContent) => updateJournal(activeJournal.id, 'description', newContent)}
              />
            </>
          ) : (
            <p className="text-gray-500">Select a journal from the list to start writing.</p>
          )}
        </div>
      </div>
    </>
  );
}