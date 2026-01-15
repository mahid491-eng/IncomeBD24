
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { adminService } from '../services/admin';
import { QuizQuestion } from '../types';

const DailyIncomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(storage.getUser());
  const [adminSettings] = useState(adminService.getSettings());
  
  useEffect(() => {
    if (!adminSettings.isDailyIncomeEnabled || adminSettings.maintenanceMode) {
      alert("This feature is currently unavailable.");
      navigate('/home');
    }
  }, [adminSettings, navigate]);

  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const quizCategories = ['All', ...Array.from(new Set(adminSettings.quizQuestions.map(q => q.category)))];
  const [filter, setFilter] = useState<'All' | string>(quizCategories[0]);

  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('completed_quizzes') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('completed_quizzes', JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  const handleAnswer = (option: string) => {
    if (!activeQuiz) return;
    if (option === activeQuiz.answer) {
      setQuizFeedback('correct');
      setTimeout(() => {
        storage.updateBalance(activeQuiz.reward);
        setCompletedQuizzes(prev => [...prev, activeQuiz.id]);
        setUserData(storage.getUser());
        setActiveQuiz(null);
      }, 1000);
    } else {
      setQuizFeedback('wrong');
      setTimeout(() => setActiveQuiz(null), 1000);
    }
  };

  const filteredTasks = adminSettings.quizQuestions.filter(q => filter === 'All' || q.category === filter);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="px-6 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 rounded-xl text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Daily Income</h2>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 font-black text-xs">
          ৳{userData.balance.toFixed(2)}
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto p-6 scrollbar-hide">
        {quizCategories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const isDone = completedQuizzes.includes(task.id);
          return (
            <div key={task.id} className={`p-5 rounded-3xl border transition-all ${isDone ? 'bg-slate-900/40 border-emerald-500/10 opacity-60' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase bg-indigo-500/10 text-indigo-400`}>
                  {task.category}
                </span>
                <span className="text-xs font-black text-emerald-400">৳{task.reward.toFixed(2)}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-300 mb-6">{task.question}</h3>
              <button 
                disabled={isDone}
                onClick={() => { setActiveQuiz(task); setQuizFeedback(null); }}
                className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest ${isDone ? 'bg-slate-800 text-slate-600' : 'bg-white text-black'}`}
              >
                {isDone ? 'Claimed' : 'Solve & Earn'}
              </button>
            </div>
          );
        })}
      </main>

      {activeQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-black text-white mb-8 text-center">{activeQuiz.question}</h2>
            <div className="grid grid-cols-1 gap-3">
              {activeQuiz.options.map((opt, i) => (
                <button 
                  key={i}
                  disabled={!!quizFeedback}
                  onClick={() => handleAnswer(opt)}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all border ${
                    quizFeedback === 'correct' && opt === activeQuiz.answer ? 'bg-emerald-500 border-emerald-400 text-white' :
                    quizFeedback === 'wrong' && opt !== activeQuiz.answer ? 'bg-slate-950 border-slate-800 text-slate-500' :
                    'bg-slate-950 border-slate-800 text-white hover:border-indigo-500'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {quizFeedback === 'correct' && <p className="mt-6 text-center text-emerald-400 font-black animate-bounce text-xs uppercase tracking-widest tracking-[0.3em]">Correct! +৳{activeQuiz.reward}</p>}
            {quizFeedback === 'wrong' && <p className="mt-6 text-center text-red-400 font-black text-xs uppercase tracking-[0.3em]">Wrong Answer!</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyIncomeScreen;
