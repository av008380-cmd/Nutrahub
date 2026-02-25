import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Plus, Minus, Send, Mic, MicOff, Loader2, Dumbbell, MessageCircle } from 'lucide-react';
import { categories, foodData, budgetPlans, timingPlans, avBaseline, avTimelineData, FoodItem, MealItem, DailyLogEntry } from './data';
import { generateText, generateGymBackground, searchFoodAI, generateWorkoutPlan } from './services/ai';
import { useLiveAudio } from './hooks/useLiveAudio';

// --- COMPONENTS ---

const Loader = ({ isLoaded }: { isLoaded: boolean }) => (
  <AnimatePresence>
    {!isLoaded && (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center"
      >
        <motion.svg
          initial={{ scale: 0.5, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          viewBox="0 0 200 200"
          className="w-[150px] h-[150px] overflow-visible"
        >
          <circle cx="100" cy="40" r="20" className="fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          <path d="M 60 75 L 140 75 L 115 150 L 85 150 Z" className="fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          <path className="guy-arm-left" d="M 65 75 Q 25 60 35 30" stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path className="guy-arm-right" d="M 135 75 Q 175 60 165 30" stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" />
        </motion.svg>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="mt-5 text-2xl font-black tracking-[2px] font-sans text-white uppercase"
        >
          NUTRITION HUB
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Background = ({ bgImage, bgStatus }: { bgImage: string | null, bgStatus: string }) => (
  <>
    <div
      className="fixed top-0 left-0 w-screen h-screen -z-20 bg-[#050505] bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        filter: 'brightness(0.6) contrast(1.1)',
      }}
    />
    {/* Window Frame Overlay for Jesko Jets look */}
    <div className="fixed inset-0 pointer-events-none -z-10 border-[16px] md:border-[32px] border-[#050505] rounded-[32px] md:rounded-[64px] m-2 md:m-4 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />
    
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className="h-[35vh] flex flex-col items-center justify-center text-center bg-transparent p-5 mt-8"
    >
      <h1 className="font-serif text-[clamp(32px,8vw,64px)] font-black tracking-[-1px] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[1.1]">
        AMIT'S NUTRITION HUB
      </h1>
      <p className="text-[#e4e4e7] text-[clamp(14px,3vw,18px)] mt-2.5 font-medium uppercase tracking-[2px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
        Luxury Edition • Intelligent Tracking
      </p>
      <AnimatePresence>
        {bgStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-xs text-[var(--color-ios-green)] bg-black/50 px-4 py-1.5 rounded-full border border-[var(--color-ios-green)]/30 backdrop-blur-md"
          >
            {bgStatus}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

    {/* Indian Flag */}
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.2, rotate: 10 }}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-[1000] text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-default"
    >
      🇮🇳
    </motion.div>
  </>
);

const Toast = ({ msg }: { msg: string }) => (
  <AnimatePresence>
    {msg && (
      <motion.div
        initial={{ opacity: 0, y: 100, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 100, x: '-50%' }}
        className="fixed bottom-10 left-1/2 bg-white text-black px-8 py-4 rounded-full text-[15px] font-extrabold z-[9999] shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
      >
        {msg}
      </motion.div>
    )}
  </AnimatePresence>
);

// --- TABS ---

const PlateCalc = ({ mealData, setMealData, showToast }: any) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState(100);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const allFoods = [...(foodData || []), ...customFoods];
  const filteredFoods = allFoods.filter(f => {
    const matchCat = selectedCat === 'All' || f.cat === selectedCat;
    const matchQ = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const handleSearchAI = async () => {
    if (!searchQuery) return;
    setIsSearchingAI(true);
    const res = await searchFoodAI(searchQuery);
    if (res && res.name) {
      setCustomFoods(prev => [...prev, res]);
      showToast(`Added ${res.name} from AI database!`);
    } else {
      showToast("Failed to find food via AI.");
    }
    setIsSearchingAI(false);
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQty(food.mode === 'count' ? 1 : 100);
  };

  const adjQty = (dir: number) => {
    if (!selectedFood) return;
    const step = selectedFood.mode === 'count' ? 1 : 10;
    setQty(Math.max(1, qty + dir * step));
  };

  const getMultiplier = () => {
    if (!selectedFood) return 0;
    return selectedFood.mode === 'count' ? qty : qty / 100;
  };

  const addToMeal = () => {
    if (!selectedFood || qty <= 0) return showToast("Select food and quantity.");
    const m = getMultiplier();
    setMealData([...mealData, {
      id: Date.now(),
      name: selectedFood.name,
      em: selectedFood.em,
      qtyStr: `${qty} ${selectedFood.mode === 'count' ? selectedFood.unit + '(s)' : selectedFood.mode}`,
      p: selectedFood.p * m,
      c: selectedFood.c * m,
      fat: selectedFood.fat * m,
      k: selectedFood.k * m,
      f: selectedFood.f * m
    }]);
    showToast("Added to protocol.");
  };

  const removeMealItem = (id: number) => {
    setMealData(mealData.filter((item: any) => item.id !== id));
  };

  const totalP = mealData.reduce((s: number, i: any) => s + i.p, 0);
  const totalC = mealData.reduce((s: number, i: any) => s + i.c, 0);
  const totalFat = mealData.reduce((s: number, i: any) => s + i.fat, 0);
  const totalK = mealData.reduce((s: number, i: any) => s + i.k, 0);
  const totalF = mealData.reduce((s: number, i: any) => s + i.f, 0);

  const analyzePlateAI = async () => {
    if (mealData.length === 0) return showToast("Plate is empty.");
    setIsAnalyzing(true);
    setAiFeedback('✨ Synthesizing analysis...');
    const prompt = `Plate: ${mealData.map((m:any)=>m.name).join(",")}. Macros: ${Math.round(totalP)}g P, ${Math.round(totalK)} Cals. Max 3 sentences. Rate for muscle building.`;
    const res = await generateText(prompt);
    setAiFeedback(`🤖 Analysis:\n${res}`);
    setIsAnalyzing(false);
  };

  const generateRecipeAI = async () => {
    if (mealData.length === 0) return showToast("Plate is empty.");
    setIsAnalyzing(true);
    setAiFeedback('✨ Synthesizing recipe...');
    const prompt = `Ingredients: ${mealData.map((m:any)=>m.name).join(",")}. Create a brief, 3-step luxury healthy recipe.`;
    const res = await generateText(prompt);
    setAiFeedback(`🧑‍🍳 Recipe Protocol:\n${res}`);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-[1.3fr_0.7fr] gap-6 md:gap-8 items-start">
      {/* LEFT: Food Selector */}
      <div className="glass-card rounded-[24px] p-6 w-full">
        <div className="font-serif text-2xl font-extrabold mb-5 flex items-center gap-2.5 tracking-[-0.5px]">🥘 Build Your Plate</div>
        
        <div className="relative mb-5">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-mu)] w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder="Search (e.g. Rajma, Oats, Paneer)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-[18px] pl-[52px] border border-[var(--color-bd)] rounded-2xl font-sans text-base bg-black/50 text-white outline-none transition-all duration-300 focus:bg-black/80 focus:border-white focus:ring-2 focus:ring-white/10 placeholder:text-zinc-500"
          />
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-3 mb-4 custom-scrollbar cursor-grab active:cursor-grabbing">
          {categories?.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`border rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-300 active:scale-90 ${selectedCat === c ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-[var(--color-bd)]'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-5 max-h-[45vh] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredFoods.length === 0 ? (
            <div className="col-span-full text-center p-[30px_10px] text-[var(--color-mu)] bg-white/5 rounded-2xl border border-dashed border-[var(--color-bd)] flex flex-col items-center">
              <div className="text-base font-bold text-white mb-3">"{searchQuery}" not found locally.</div>
              <button 
                onClick={handleSearchAI} 
                disabled={isSearchingAI}
                className="px-6 py-3 bg-[var(--color-ios-purple)] text-white font-bold rounded-full flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSearchingAI ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Search AI Database
              </button>
            </div>
          ) : (
            filteredFoods.map((f, idx) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleSelectFood(f)}
                className={`border rounded-2xl p-[20px_12px] cursor-pointer text-center transition-all duration-400 relative group ${selectedFood?.name === f.name ? 'border-white bg-white/10 -translate-y-1 scale-[1.02] shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-2' : 'border-[var(--color-bd)] bg-white/5 hover:-translate-y-1 hover:bg-white/10 hover:border-white/30 active:scale-95'}`}
              >
                <span className="text-[40px] block mb-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">{f.em}</span>
                <div className="text-sm font-extrabold leading-tight h-[2.5em] overflow-hidden line-clamp-2">{f.name}</div>
                <div className="flex justify-center gap-2.5 mt-3 text-xs font-extrabold">
                  <span className="text-[var(--color-ios-green)]">{f.p}g P</span>
                  <span className="text-[var(--color-carb)]">{f.c}g C</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence>
          {selectedFood?.tip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[rgba(255,190,11,0.1)] border border-[rgba(255,190,11,0.3)] text-[var(--color-sf)] p-4 rounded-2xl text-sm mb-5 font-semibold leading-relaxed"
            >
              💡 <b>Intel:</b> {selectedFood.tip}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 bg-black/60 border border-[var(--color-bd)] rounded-2xl p-5"
            >
              <div className="text-lg font-extrabold text-white mb-2.5">
                {qty} {selectedFood.mode === 'count' ? selectedFood.unit + '(s)' : selectedFood.mode} of {selectedFood.name}
              </div>
              <div className="flex gap-4 text-sm text-[var(--color-mu)] flex-wrap">
                <span>P: <strong className="text-white font-extrabold text-[15px]">{(selectedFood.p * getMultiplier()).toFixed(1)}g</strong></span>
                <span>C: <strong className="text-white font-extrabold text-[15px]">{(selectedFood.c * getMultiplier()).toFixed(1)}g</strong></span>
                <span>Fat: <strong className="text-white font-extrabold text-[15px]">{(selectedFood.fat * getMultiplier()).toFixed(1)}g</strong></span>
                <span>Cal: <strong className="text-white font-extrabold text-[15px]">{Math.round(selectedFood.k * getMultiplier())}</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/5 rounded-2xl p-6 mb-5 border border-[var(--color-bd)]">
          <div className="flex items-center gap-5 justify-center">
            <button onClick={() => adjQty(-1)} className="w-[54px] h-[54px] rounded-full border border-white/20 bg-white/5 text-white text-[28px] flex items-center justify-center transition-all duration-300 active:bg-white active:text-black active:scale-90"><Minus /></button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="border-none bg-transparent text-[42px] font-black w-[110px] text-center font-sans text-white outline-none tabular-nums"
            />
            <span className="text-base text-[var(--color-mu)] w-[30px] font-extrabold">{selectedFood?.mode === 'count' ? selectedFood.unit + '(s)' : 'g'}</span>
            <button onClick={() => adjQty(1)} className="w-[54px] h-[54px] rounded-full border border-white/20 bg-white/5 text-white text-[28px] flex items-center justify-center transition-all duration-300 active:bg-white active:text-black active:scale-90"><Plus /></button>
          </div>
          <div className="flex gap-3 mt-5 overflow-x-auto pb-2 custom-scrollbar cursor-grab active:cursor-grabbing">
            {(selectedFood?.mode === 'count' ? [1, 2, 3, 5] : [50, 100, 200, 250]).map(v => (
              <button
                key={v}
                onClick={() => setQty(v)}
                className="bg-black/50 border border-[var(--color-bd)] rounded-xl px-5 py-3 text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-300 active:bg-white active:text-black active:border-white active:scale-90"
              >
                {v}{selectedFood?.mode === 'count' ? '' : 'g'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={addToMeal} className="w-full p-5 bg-white text-black border-none rounded-2xl text-base font-black uppercase tracking-[1px] transition-all duration-300 active:scale-95 active:bg-zinc-200">
          Add to Plate
        </button>
      </div>

      {/* RIGHT: My Plate Summary */}
      <div className="glass-card rounded-[24px] p-6 w-full">
        <div className="font-serif text-2xl font-extrabold mb-5 flex items-center gap-2.5 tracking-[-0.5px]">🍽️ Current Plate</div>
        
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <div className="flex-1 min-w-[65px] bg-black/40 rounded-2xl p-[16px_8px] border border-[var(--color-bd)] text-center">
            <div className="text-[10px] uppercase text-[var(--color-mu)] font-extrabold tracking-[1px]">Protein</div>
            <div className="font-serif text-[26px] font-black leading-none mt-2.5 tabular-nums text-[var(--color-ios-green)]">{Math.round(totalP)}</div>
          </div>
          <div className="flex-1 min-w-[65px] bg-black/40 rounded-2xl p-[16px_8px] border border-[var(--color-bd)] text-center">
            <div className="text-[10px] uppercase text-[var(--color-mu)] font-extrabold tracking-[1px]">Carbs</div>
            <div className="font-serif text-[26px] font-black leading-none mt-2.5 tabular-nums text-[var(--color-carb)]">{Math.round(totalC)}</div>
          </div>
          <div className="flex-1 min-w-[65px] bg-black/40 rounded-2xl p-[16px_8px] border border-[var(--color-bd)] text-center">
            <div className="text-[10px] uppercase text-[var(--color-mu)] font-extrabold tracking-[1px]">Fat</div>
            <div className="font-serif text-[26px] font-black leading-none mt-2.5 tabular-nums text-[var(--color-fat)]">{Math.round(totalFat)}</div>
          </div>
          <div className="flex-1 min-w-[65px] bg-black/40 rounded-2xl p-[16px_8px] border border-[var(--color-bd)] text-center">
            <div className="text-[10px] uppercase text-[var(--color-mu)] font-extrabold tracking-[1px]">Cals</div>
            <div className="font-serif text-[26px] font-black leading-none mt-2.5 tabular-nums text-[var(--color-sf)]">{Math.round(totalK)}</div>
          </div>
          <div className="flex-1 min-w-[65px] bg-black/40 rounded-2xl p-[16px_8px] border border-[var(--color-bd)] text-center">
            <div className="text-[10px] uppercase text-[var(--color-mu)] font-extrabold tracking-[1px]">Fiber</div>
            <div className="font-serif text-[26px] font-black leading-none mt-2.5 tabular-nums text-[var(--color-fiber)]">{Math.round(totalF)}</div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto mt-2.5 pr-2 custom-scrollbar">
          <AnimatePresence>
            {mealData.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-[50px_20px] text-[var(--color-mu)] text-[15px] font-semibold">
                Your plate is empty.<br/>Build your masterpiece!
              </motion.div>
            ) : (
              mealData.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-[18px] border border-[var(--color-bd)] mb-3"
                >
                  <div className="text-[30px]">{item.em}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-white text-[15px] mb-1">{item.name}</div>
                    <div className="text-[var(--color-mu)] text-[13px] font-semibold">{item.qtyStr}</div>
                  </div>
                  <div className="text-right text-[13px]">
                    <div className="text-[var(--color-ios-green)] font-extrabold">{item.p.toFixed(1)}g P</div>
                    <div className="text-[var(--color-carb)] text-[11px] font-bold">{item.c.toFixed(1)}g C</div>
                  </div>
                  <button onClick={() => removeMealItem(item.id)} className="bg-[rgba(255,0,110,0.1)] border border-[rgba(255,0,110,0.3)] text-[var(--color-ios-red)] w-10 h-10 rounded-full text-2xl flex items-center justify-center transition-all duration-300 active:bg-[var(--color-ios-red)] active:text-white active:scale-80">
                    <X size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 mt-5">
          <button onClick={analyzePlateAI} disabled={isAnalyzing} className="w-full p-5 bg-gradient-to-br from-[var(--color-ios-purple)] to-[#5a189a] text-white border border-white/20 rounded-2xl text-base font-black uppercase tracking-[1px] transition-all duration-300 active:scale-95 disabled:opacity-50">
            ✨ AI Deep Analysis
          </button>
          <button onClick={generateRecipeAI} disabled={isAnalyzing} className="w-full p-4 bg-transparent text-white border border-white rounded-2xl text-sm font-black uppercase tracking-[1px] transition-all duration-300 active:scale-95 disabled:opacity-50">
            🧑‍🍳 AI Recipe
          </button>
        </div>

        <AnimatePresence>
          {aiFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-start mt-5 text-sm leading-relaxed text-white border border-[var(--color-ai)] p-4 bg-white/5 rounded-[18px] whitespace-pre-wrap"
            >
              {aiFeedback}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AnalysisLog = ({ mealData, setMealData, dailyLog, setDailyLog, showToast }: any) => {
  const analyzeAndLog = () => {
    if (mealData.length === 0) return showToast("Empty plate.");
    const tp = Math.round(mealData.reduce((s: number, i: any) => s + i.p, 0));
    const tc = Math.round(mealData.reduce((s: number, i: any) => s + i.c, 0));
    const tk = Math.round(mealData.reduce((s: number, i: any) => s + i.k, 0));
    setDailyLog([{
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: mealData.map((m: any) => m.name).join(", "),
      p: tp, c: tc, k: tk
    }, ...dailyLog]);
    setMealData([]);
    showToast("Saved to memory bank.");
  };

  return (
    <div className="glass-card rounded-[24px] p-6">
      <div className="font-serif text-2xl font-extrabold mb-5 text-[var(--color-ios-green)] tracking-[-0.5px]">📅 Meal Analysis Log</div>
      <div className="mb-5 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {dailyLog.length === 0 ? (
          <div className="text-center text-[var(--color-mu)] text-[15px] p-10 font-semibold">No meals logged yet. Go to Plate Calc to save entries.</div>
        ) : (
          dailyLog.map((log: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start gap-2 p-4 bg-white/5 rounded-[18px] border border-[var(--color-bd)] mb-3"
            >
              <div className="font-black text-[var(--color-mu)] text-xs">🕒 {log.time}</div>
              <div className="text-sm font-bold">{log.items}</div>
              <div className="flex gap-2.5 text-xs font-extrabold text-white">
                <span className="text-[var(--color-ios-green)]">{log.p}g Pro</span> | 
                <span className="text-[var(--color-carb)]">{log.c}g Carb</span> | 
                <span className="text-[var(--color-ios-purple)]">{log.k} kcal</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
      <button onClick={analyzeAndLog} className="w-full p-5 bg-[var(--color-ios-green)] text-black border-none rounded-2xl text-base font-black uppercase tracking-[1px] transition-all duration-300 active:scale-95">
        📝 Save Current Plate to Log
      </button>
    </div>
  );
};

const BmiBudget = ({ showToast }: any) => {
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [bmiRes, setBmiRes] = useState<any>(null);
  const [budgetCat, setBudgetCat] = useState('Veg');

  const calcBMI = () => {
    const weight = parseFloat(w);
    const height = parseFloat(h) / 100;
    if (!weight || !height) return showToast("Input metrics required.");
    const bmi = (weight / (height * height)).toFixed(1);
    let cat = "", msg = "";
    if (parseFloat(bmi) < 18.5) { cat = "Underweight"; msg = "Surplus required. Increase protein mass."; }
    else if (parseFloat(bmi) < 24.9) { cat = "Optimal"; msg = "Maintain trajectory with high protein."; }
    else if (parseFloat(bmi) < 29.9) { cat = "Overweight"; msg = "Initiate deficit. Cut empty carbs."; }
    else { cat = "Critical"; msg = "Strict deficit protocols required."; }
    setBmiRes({ bmi, cat, msg });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-[24px] p-6">
        <div className="font-serif text-2xl font-extrabold mb-5 tracking-[-0.5px]">⚖️ BMI Calculator</div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-extrabold uppercase text-[var(--color-mu)] block mb-2">Weight (kg)</label>
            <input type="number" placeholder="e.g. 70" value={w} onChange={e=>setW(e.target.value)} className="w-full p-[18px] border border-[var(--color-bd)] rounded-2xl font-sans text-base outline-none bg-black/50 text-white focus:border-white" />
          </div>
          <div>
            <label className="text-xs font-extrabold uppercase text-[var(--color-mu)] block mb-2">Height (cm)</label>
            <input type="number" placeholder="e.g. 175" value={h} onChange={e=>setH(e.target.value)} className="w-full p-[18px] border border-[var(--color-bd)] rounded-2xl font-sans text-base outline-none bg-black/50 text-white focus:border-white" />
          </div>
        </div>
        <button onClick={calcBMI} className="w-full p-5 bg-white text-black border-none rounded-2xl text-base font-black uppercase tracking-[1px] transition-all duration-300 active:scale-95">
          Calculate Status
        </button>
        
        <AnimatePresence>
          {bmiRes && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-[30px] bg-black/50 rounded-[24px] border border-[var(--color-bd)] mt-6">
              <div className="text-[64px] font-black text-white font-serif leading-none">{bmiRes.bmi}</div>
              <div className="font-black mt-4 text-[var(--color-ios-green)] text-lg uppercase tracking-[2px]">{bmiRes.cat}</div>
              <p className="text-[15px] text-[var(--color-mu)] mt-3 leading-relaxed">{bmiRes.msg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="glass-card rounded-[24px] p-6">
        <div className="font-serif text-2xl font-extrabold mb-5 tracking-[-0.5px]">💰 Budget Diet Plans</div>
        <p className="text-sm text-[var(--color-mu)] mb-6">Maximized protein per rupee for lean gains.</p>
        <div className="flex gap-2.5 overflow-x-auto pb-3 mb-4 custom-scrollbar">
          {['Veg', 'Egg', 'Non-Veg'].map(c => (
            <button key={c} onClick={() => setBudgetCat(c)} className={`border rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-300 active:scale-90 ${budgetCat === c ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-[var(--color-bd)]'}`}>
              {c === 'Egg' ? 'Eggetarian' : c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {budgetPlans[budgetCat]?.map((p: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-[var(--color-bd)] rounded-2xl p-5">
              <div className="font-serif text-lg font-extrabold">{p.title}</div>
              <div className="text-sm text-[var(--color-mu)] my-2">{p.desc}</div>
              <div className="flex justify-between mt-4 items-center">
                <span className="font-black text-[var(--color-ios-green)]">{p.cost}</span>
                <span className="text-xs font-extrabold bg-black/50 px-3 py-1.5 rounded-xl">{p.macros}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PowerFoods = () => {
  const items = ["Soya Chunks", "Whey Protein", "Chicken Breast", "Rajma (Cooked)", "Egg White"].map(n => (foodData || []).find(f => f.name === n)).filter(Boolean);
  return (
    <div className="glass-card rounded-[24px] p-6">
      <div className="font-serif text-2xl font-extrabold mb-5 text-[var(--color-sf)] tracking-[-0.5px]">⚡ Power Superfoods</div>
      <p className="text-sm text-[var(--color-mu)] mb-6">The elite tier of Indian nutrition. Dense, accessible, and essential.</p>
      <div className="flex flex-col gap-4">
        {items?.map((f: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 bg-white/5 border border-[var(--color-bd)] p-5 rounded-[18px] items-center">
            <div className="text-[32px]">{f.em}</div>
            <div>
              <div className="font-extrabold">{f.name}</div>
              <div className="text-xs text-[var(--color-ios-red)] font-bold mt-1">{f.p}g P / 100g</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Timing = () => {
  return (
    <div className="glass-card rounded-[24px] p-6">
      <div className="font-serif text-2xl font-extrabold mb-5 text-[var(--color-ios-blue)] tracking-[-0.5px]">⏰ Master Scheduling</div>
      <p className="text-sm text-[var(--color-mu)] mb-6">Optimal nutrient timing for max absorption and recovery.</p>
      <div className="flex flex-col gap-4">
        {timingPlans['All']?.map((s: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 items-center bg-white/5 border border-[var(--color-bd)] rounded-2xl p-5">
            <div className="font-black text-[var(--color-ios-blue)] text-sm min-w-[70px]">{s.time}</div>
            <div>
              <div className="font-extrabold text-base">{s.title}</div>
              <div className="text-[13px] text-[var(--color-mu)] mt-1">{s.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AiCoach = ({ mealData, dailyLog, showToast }: any) => {
  const [weight, setWeight] = useState('');
  const [diet, setDiet] = useState('Vegetarian');
  const [goal, setGoal] = useState('Fat Loss');
  const [budget, setBudget] = useState('Normal');
  const [chat, setChat] = useState([{ text: "Greetings. I am the Hub's integrated intelligence. Formulate your plan above, or query me directly regarding your current macros.", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  
  const chatRef = useRef<HTMLDivElement>(null);

  const systemInstruction = `You are Amit, an expert luxury fitness coach. The user weighs ${weight || 'unknown'}kg, follows a ${diet} diet, has a budget preference of ${budget}, and their goal is ${goal}. Their current plate has ${mealData.length ? mealData.map((m:any)=>m.name).join(",") : "nothing"}. Be concise, motivating, and professional.`;
  const { isConnected, isConnecting, error, connect, disconnect } = useLiveAudio(systemInstruction);

  useEffect(() => {
    if (error) showToast(error);
  }, [error]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, isTyping]);

  const handleGeneratePlan = async () => {
    if (!weight) return showToast("Metrics required.");
    setChat(prev => [...prev, { text: `Formulate ${diet} plan for ${weight}kg aiming for ${goal} with a ${budget} budget.`, sender: 'user' }]);
    setIsTyping(true);
    const res = await generateText(`Expert luxury fitness coach. ${weight}kg, ${diet}, goal: ${goal}, budget: ${budget}. Short 1-day plan.`);
    setChat(prev => [...prev, { text: res, sender: 'ai' }]);
    setIsTyping(false);
  };

  const handleGrocery = async () => {
    setChat(prev => [...prev, { text: `Generate weekly grocery list for a ${budget} budget.`, sender: 'user' }]);
    setIsTyping(true);
    const res = await generateText(`Categorized weekly Indian grocery list for ${diet} diet on a ${budget} budget. Concise bullet points.`);
    setChat(prev => [...prev, { text: res, sender: 'ai' }]);
    setIsTyping(false);
  };

  const handleGenerateWorkout = async () => {
    setChat(prev => [...prev, { text: `Generate a full week workout plan for ${goal}.`, sender: 'user' }]);
    setIsTyping(true);
    const res = await generateWorkoutPlan(goal);
    if (res && res.days) {
      setWorkoutPlan(res);
      setChat(prev => [...prev, { text: "I have generated a 7-day workout protocol. You can view it below.", sender: 'ai' }]);
    } else {
      setChat(prev => [...prev, { text: "Failed to generate workout plan.", sender: 'ai' }]);
    }
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setChat(prev => [...prev, { text: msg, sender: 'user' }]);
    setIsTyping(true);
    const p = `Coach Amit. Plate: ${mealData.length ? mealData.map((m:any)=>m.name).join(",") : "Empty"}. Logged: ${dailyLog.reduce((s:number,l:any)=>s+l.k,0)}cal. Q: "${msg}". Answer concisely.`;
    const res = await generateText(p);
    setChat(prev => [...prev, { text: res, sender: 'ai' }]);
    setIsTyping(false);
  };

  return (
    <div className="glass-card rounded-[24px] p-6">
      <div className="font-serif text-2xl font-extrabold mb-5 text-[var(--color-ai)] tracking-[-0.5px]">🤖 Intelligent Coach</div>
      <p className="text-sm text-[var(--color-mu)] mb-6">A fully integrated AI that reads your live plate and analysis log. Use text or voice.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input type="number" placeholder="Body Weight (kg)" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full p-[18px] border border-[var(--color-bd)] rounded-2xl font-sans text-[15px] font-semibold bg-black/50 text-white outline-none focus:border-[var(--color-ai)]" />
        <select value={diet} onChange={e=>setDiet(e.target.value)} className="w-full p-[18px] border border-[var(--color-bd)] rounded-2xl font-sans text-[15px] font-semibold bg-black/50 text-white outline-none focus:border-[var(--color-ai)] appearance-none">
          <option value="Vegetarian" className="bg-[#111] text-white">Vegetarian</option>
          <option value="Eggetarian" className="bg-[#111] text-white">Eggetarian</option>
          <option value="Non-Vegetarian" className="bg-[#111] text-white">Non-Vegetarian</option>
        </select>
        <select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full p-[18px] border border-[var(--color-bd)] rounded-2xl font-sans text-[15px] font-semibold bg-black/50 text-white outline-none focus:border-[var(--color-ai)] appearance-none">
          <option value="Fat Loss" className="bg-[#111] text-white">Fat Loss</option>
          <option value="Lean Body" className="bg-[#111] text-white">Lean Body</option>
          <option value="Bulk Body" className="bg-[#111] text-white">Bulk Body</option>
          <option value="General Nutrition" className="bg-[#111] text-white">Maintenance</option>
        </select>
        <select value={budget} onChange={e=>setBudget(e.target.value)} className="w-full p-[18px] border border-[var(--color-bd)] rounded-2xl font-sans text-[15px] font-semibold bg-black/50 text-white outline-none focus:border-[var(--color-ai)] appearance-none">
          <option value="Budget" className="bg-[#111] text-white">Budget Friendly</option>
          <option value="Normal" className="bg-[#111] text-white">Normal Budget</option>
          <option value="Luxury" className="bg-[#111] text-white">Luxury / Premium</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGeneratePlan} disabled={isTyping || isConnected} className="flex-1 p-4 md:p-5 bg-gradient-to-br from-[var(--color-ios-purple)] to-[#5a189a] text-white border border-white/20 rounded-2xl text-sm md:text-base font-black uppercase tracking-[1px] transition-all duration-300 disabled:opacity-50">
          🪄 Generate Plan
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGrocery} disabled={isTyping || isConnected} className="flex-1 p-4 md:p-5 bg-transparent text-white border border-white rounded-2xl text-sm md:text-base font-black uppercase tracking-[1px] transition-all duration-300 disabled:opacity-50">
          🛒 Grocery List
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerateWorkout} disabled={isTyping || isConnected} className="flex-1 p-4 md:p-5 bg-transparent text-white border border-white rounded-2xl text-sm md:text-base font-black uppercase tracking-[1px] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
          <Dumbbell size={20} /> Workout
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={isConnected ? disconnect : connect} 
          disabled={isConnecting}
          className={`flex-1 p-4 md:p-5 border rounded-2xl text-sm md:text-base font-black uppercase tracking-[1px] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 ${isConnected ? 'bg-red-500 text-white border-red-500' : 'bg-[var(--color-ios-green)] text-black border-[var(--color-ios-green)]'}`}
        >
          {isConnecting ? 'Connecting...' : isConnected ? <><MicOff size={20} /> Stop Voice</> : <><Mic size={20} /> Voice Coach</>}
        </motion.button>
      </div>

      <AnimatePresence>
        {workoutPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 md:p-6 bg-black/60 border border-[var(--color-bd)] rounded-[24px]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-extrabold text-white">7-Day Protocol</h3>
            </div>
            <div className="flex flex-col gap-6">
              {workoutPlan.days?.map((day: any, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-2 border-[var(--color-ios-purple)] pl-4"
                >
                  <div className="font-black text-[var(--color-ios-purple)] uppercase tracking-[1px] text-sm mb-1">{day.day}</div>
                  <div className="font-bold text-white mb-3">{day.focus}</div>
                  <div className="flex flex-col gap-3">
                    {day.exercises?.map((ex: any, j: number) => (
                      <motion.div 
                        key={j} 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 p-4 rounded-xl border border-[var(--color-bd)]"
                      >
                        <div className="font-extrabold text-white">{ex.name}</div>
                        <div className="text-xs text-[var(--color-mu)] mt-1">{ex.sets}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={chatRef} className="flex flex-col gap-4 bg-black/40 border border-[var(--color-bd)] rounded-[24px] p-6 h-[400px] overflow-y-auto mb-6 custom-scrollbar">
        {chat.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[85%] p-[16px_20px] rounded-[20px] text-[15px] leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-br from-[var(--color-ios-purple)] to-[#5a189a] text-white self-end rounded-br-[6px] border border-white/10' : 'bg-white/5 border border-[var(--color-bd)] self-start rounded-bl-[6px] whitespace-pre-wrap'}`}>
            {msg.text}
          </motion.div>
        ))}
        {isTyping && (
          <div className="max-w-[85%] p-[16px_20px] rounded-[20px] text-[15px] bg-white/5 border border-[var(--color-bd)] self-start rounded-bl-[6px]">
            <span className="animate-blink">...</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input type="text" placeholder="Initialize query..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} className="flex-1 p-[18px_24px] border border-[var(--color-bd)] rounded-full outline-none font-sans text-base bg-black/50 text-white focus:border-white" />
        <button onClick={handleSend} disabled={isTyping} className="bg-white text-black border-none w-[60px] h-[60px] rounded-full flex items-center justify-center transition-transform duration-200 active:scale-85 disabled:opacity-50">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

const AvPlan = ({ mealData, dailyLog }: any) => {
  let tp = 0, tc = 0, tfat = 0, tk = 0;
  dailyLog.concat(mealData).forEach((i:any) => { tp += i.p; tc += i.c; tk += i.k; if(i.fat) tfat += i.fat; });

  return (
    <div className="glass-card rounded-[24px] p-6">
      <div className="font-serif text-2xl font-extrabold mb-5 tracking-[-0.5px]">👑 The Apex Protocol (AV)</div>
      <p className="text-sm text-[var(--color-mu)] mb-8">The baseline schedule for elite maintenance and sustained hypertrophy.</p>
      
      <div className="relative ml-4 pl-8 border-l-2 border-white/10">
        {avTimelineData?.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="mb-8 relative">
            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-black shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            <div className="text-xs font-black text-[var(--color-mu)] uppercase mb-2 tracking-[1px]">{s.time}</div>
            <div className="font-extrabold text-lg text-white">{s.title}</div>
            <div className="text-sm text-[var(--color-mu)] mt-2 leading-relaxed">{s.desc}</div>
            <div className="text-xs font-bold text-[var(--color-ios-green)] mt-1">{s.macros}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-black/60 rounded-[32px] p-8 mt-8 border border-[var(--color-bd)]">
        <div className="font-black text-[20px] mb-6 text-center text-white font-serif tracking-[-0.5px]">Plate vs Protocol</div>
        
        <div className="mb-5">
          <div className="flex justify-between text-sm font-bold mb-2.5 text-white"><span>Protein</span> <span>{Math.round(tp)}g / {avBaseline.p}g</span></div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden relative"><div className="h-full bg-[var(--color-ios-green)] rounded-full transition-all duration-1000 ease-[var(--spring)]" style={{width: `${Math.min(100, (tp/avBaseline.p)*100)}%`}} /></div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between text-sm font-bold mb-2.5 text-white"><span>Carbs</span> <span>{Math.round(tc)}g / {avBaseline.c}g</span></div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden relative"><div className="h-full bg-[var(--color-carb)] rounded-full transition-all duration-1000 ease-[var(--spring)]" style={{width: `${Math.min(100, (tc/avBaseline.c)*100)}%`}} /></div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between text-sm font-bold mb-2.5 text-white"><span>Fat</span> <span>{Math.round(tfat)}g / {avBaseline.fat}g</span></div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden relative"><div className="h-full bg-[var(--color-fat)] rounded-full transition-all duration-1000 ease-[var(--spring)]" style={{width: `${Math.min(100, (tfat/avBaseline.fat)*100)}%`}} /></div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between text-sm font-bold mb-2.5 text-white"><span>Calories</span> <span>{Math.round(tk)} / {avBaseline.k} kcal</span></div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden relative"><div className="h-full bg-[var(--color-ios-purple)] rounded-full transition-all duration-1000 ease-[var(--spring)]" style={{width: `${Math.min(100, (tk/avBaseline.k)*100)}%`}} /></div>
        </div>
      </div>
    </div>
  );
};

const GlobalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([{ text: "Hi! I'm Gemini. Ask me anything about fitness, nutrition, or this app.", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setChat(prev => [...prev, { text: msg, sender: 'user' }]);
    setIsTyping(true);
    const res = await generateText(`You are a helpful fitness and nutrition AI assistant for Amit's Nutrition Hub. User says: "${msg}"`);
    setChat(prev => [...prev, { text: res, sender: 'ai' }]);
    setIsTyping(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 md:right-6 w-[350px] max-w-[calc(100vw-32px)] h-[500px] max-h-[60vh] glass-card rounded-2xl z-[9999] flex flex-col overflow-hidden shadow-2xl border border-[var(--color-bd)]"
          >
            <div className="p-4 border-b border-[var(--color-bd)] bg-black/50 flex justify-between items-center">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="text-[var(--color-ios-purple)]">✨</span> Gemini Assistant
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-mu)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-black/40">
              {chat.map((msg, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-br from-[var(--color-ios-purple)] to-[#5a189a] text-white self-end rounded-br-sm' : 'bg-white/10 border border-[var(--color-bd)] text-white self-start rounded-bl-sm whitespace-pre-wrap'}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-white/10 border border-[var(--color-bd)] text-white self-start rounded-bl-sm">
                  <span className="animate-blink">...</span>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-[var(--color-bd)] bg-black/50 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-black/50 border border-[var(--color-bd)] rounded-full px-4 py-2 text-sm text-white outline-none focus:border-[var(--color-ios-purple)]"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 rounded-full bg-[var(--color-ios-purple)] text-white flex items-center justify-center disabled:opacity-50 transition-transform active:scale-90"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-[var(--color-ios-purple)] to-[#5a189a] rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(131,56,236,0.5)] z-[9999] border border-white/20"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('calc');
  const [mealData, setMealData] = useState<MealItem[]>([]);
  const [dailyLog, setDailyLog] = useState<DailyLogEntry[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgStatus, setBgStatus] = useState('Initializing AI Environment...');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1200);
    loadBg();
  }, []);

  const loadBg = async () => {
    const img = await generateGymBackground();
    if (img) {
      setBgImage(img);
      setBgStatus('Environment Synthesized. Model: gemini-2.5-flash-image');
    } else {
      setBgImage('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop');
      setBgStatus('Using default environment.');
    }
    setTimeout(() => setBgStatus(''), 4000);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const tabs = [
    { id: 'calc', label: '🍽️ Plate Calc' },
    { id: 'diet', label: '📊 Analysis Log' },
    { id: 'bmi', label: '⚖️ BMI & Budget' },
    { id: 'power', label: '⚡ Power Foods' },
    { id: 'timing', label: '⏰ Timing' },
    { id: 'ai', label: '🤖 AI Coach' },
    { id: 'av', label: '👑 AV\'s Plan' },
  ];

  return (
    <>
      <Loader isLoaded={isLoaded} />
      <Background bgImage={bgImage} bgStatus={bgStatus} />
      
      <div className="max-w-[1200px] mx-auto p-3">
        <div className="sticky top-0 z-[999] glass-nav p-[16px_12px] -mx-3">
          <div className="flex gap-3 overflow-x-auto pb-2.5 custom-scrollbar cursor-grab active:cursor-grabbing">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-6 py-3.5 rounded-full border text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-300 backdrop-blur-md active:scale-90 ${activeTab === t.id ? 'bg-white text-black border-white shadow-[0_6px_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-[var(--color-mu)] border-white/15 hover:bg-white/10 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              {activeTab === 'calc' && <PlateCalc mealData={mealData} setMealData={setMealData} showToast={showToast} />}
              {activeTab === 'diet' && <AnalysisLog mealData={mealData} setMealData={setMealData} dailyLog={dailyLog} setDailyLog={setDailyLog} showToast={showToast} />}
              {activeTab === 'bmi' && <BmiBudget showToast={showToast} />}
              {activeTab === 'power' && <PowerFoods />}
              {activeTab === 'timing' && <Timing />}
              {activeTab === 'ai' && <AiCoach mealData={mealData} dailyLog={dailyLog} showToast={showToast} />}
              {activeTab === 'av' && <AvPlan mealData={mealData} dailyLog={dailyLog} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <GlobalChat />
      <Toast msg={toastMsg} />
    </>
  );
}
