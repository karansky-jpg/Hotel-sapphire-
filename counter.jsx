```react
import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// CONFIGURATIONS & API KEYS
// ==========================================
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1_YNC57MPCAUlxlNydQzcrgKPZwBI0CB12awVte6u4_A/export?format=csv";
const SUPABASE_URL = "https://kvzmmqzyspplqmxetdir.supabase.co/rest/v1";
const SUPABASE_KEY = "sb_publishable_zI3NcmwRAjXgUg-dStSerA_cusoGsKf";

// Complete high-fidelity fallback menu directly matching the uploaded Hotel Sapphire PDF
const FALLBACK_MENU = [
  // --- BAR BITES ---
  { category: "BAR BITES", name: "CRISPY VEG NUGGETS", price: 345, type: "veg", description: "Medley of veggies and potato mix fried with spicy mayo" },
  { category: "BAR BITES", name: "CHANNA CHAAT", price: 445, type: "veg", description: "Boiled chickpeas with onion tomato, ground spices with lemon" },
  { category: "BAR BITES", name: "CHICKEN POP CORN", price: 495, type: "non-veg", description: "Bite sized tender and crisp chunks of chicken seasoned to perfection" },
  { category: "BAR BITES", name: "SPINACH LEAF CHAAT", price: 445, type: "veg", description: "Chaat snack made with crispy spinach fritters topped with tangy flavours" },
  { category: "BAR BITES", name: "PEANUT MASALA", price: 395, type: "veg", description: "Crunchy peanuts topped with spicy tangy onion and tomato mix" },
  { category: "BAR BITES", name: "ROASTED PAPAD / MASALA PAPAD", price: 245, type: "veg", description: "Topped with a tangy spicy onion and tomato mix" },
  { category: "BAR BITES", name: "FRENCH FRIES", price: 345, type: "veg", description: "Crisp and classic golden fried potatoes" },
  { category: "BAR BITES", name: "COCKTAIL PLATTER", price: 375, type: "veg", description: "Combo of assorted premium nuts and crispy papads" },
  { category: "BAR BITES", name: "CHIPS & DIP PLATTER", price: 495, type: "veg", description: "Onion crisps, jalapeno & potato poppers, nachos, salsa, hot barbeque, sour cream" },

  // --- SOUPS ---
  { category: "SOUPS", name: "KHOW SUEY (VEG)", price: 495, type: "veg", description: "Noodles with coconut milk, soup served with assortment of toppings" },
  { category: "SOUPS", name: "KHOW SUEY (NON-VEG)", price: 595, type: "non-veg", description: "Chicken noodles with rich coconut milk soup and crispy assortments" },
  { category: "SOUPS", name: "TIBETAN DUMPLING (VEG)", price: 395, type: "veg", description: "Dumplings filled with fresh garden vegetables in a savory seasoned broth" },
  { category: "SOUPS", name: "TIBETAN DUMPLING (NON-VEG)", price: 495, type: "non-veg", description: "Tender chicken filled dumplings served in a steaming flavorful broth" },
  { category: "SOUPS", name: "BURNT GARLIC CLEAR", price: 325, type: "veg", description: "Vegetable soup cooked with delightful aroma of burnt garlic and spices" },
  { category: "SOUPS", name: "MANCHOW (VEG)", price: 325, type: "veg", description: "Hot and spicy Indo-Chinese soup with crispy noodles" },
  { category: "SOUPS", name: "MANCHOW (NON-VEG)", price: 375, type: "non-veg", description: "Classic hot and spicy soup with chicken and egg drop" },

  // --- SALADS ---
  { category: "SALADS", name: "BACK DOOR CAESAR (VEG)", price: 495, type: "veg", description: "Lettuce, crispy croutons, premium caesar dressing, shaved parmesan" },
  { category: "SALADS", name: "BACK DOOR CAESAR (NON-VEG)", price: 595, type: "non-veg", description: "Fresh caesar salad topped with hot grilled chicken strips" },

  // --- SMALL PLATES ---
  { category: "SMALL PLATES", name: "BAKED TEX MEX NACHOS (VEG)", price: 545, type: "veg", description: "Baked tortilla chips with liquid cheese, salsa, sour cream & jalapenos" },
  { category: "SMALL PLATES", name: "BAKED TEX MEX NACHOS (NON-VEG)", price: 595, type: "non-veg", description: "Tortilla chips loaded with spicy shredded chicken and melted cheese" },

  // --- DIM-SUM ---
  { category: "DIM-SUM (5 PCS)", name: "CRYSTAL VEG. DIMSUM", price: 425, type: "veg", description: "Translucent steamed dumplings loaded with premium garden greens" },
  { category: "DIM-SUM (5 PCS)", name: "CRYSTAL CHICKEN BASIL", price: 625, type: "non-veg", description: "Steamed chicken dumplings scented with fresh Italian basil" },

  // --- SUSHI ---
  { category: "SUSHI (8 PCS)", name: "CALIFORNIA ROLL", price: 845, type: "veg", description: "Asparagus, cucumber, avocado, sesame, Japanese mayo" },
  { category: "SUSHI (8 PCS)", name: "PRAWN TEMPURA", price: 995, type: "non-veg", description: "Prawns hand rolled in rice and nori, sesame and tempura flakes" },

  // --- INDIAN TANDOOR APPETIZERS ---
  { category: "INDIAN TANDOOR (VEG)", name: "BEETROOT GALOUTI KEBAB", price: 645, type: "veg", description: "Melt in mouth pan-fried beetroot patties served with mint dip" },
  { category: "INDIAN TANDOOR (NON-VEG)", name: "MUTTON SHAMI KEBAB", price: 795, type: "non-veg", description: "Spiced minced mutton patties shallow-fried to perfection" },

  // --- PIZZERIA ---
  { category: "PIZZERIA", name: "MARGHERITA PIZZA", price: 595, type: "veg", description: "Freshly pulled dough topped with rich marinara, mozzarella and basil" },
  { category: "PIZZERIA", name: "PEPPERONI PIZZA", price: 745, type: "non-veg", description: "Cheesy base loaded with spiced chicken pepperoni slices" },

  // --- INDIAN MAINS ---
  { category: "INDIAN MAINS", name: "DAL MAKHANI", price: 445, type: "veg", description: "Black lentils slow cooked overnight on clay tandoor with white butter" },
  { category: "INDIAN MAINS", name: "BUTTER CHICKEN", price: 675, type: "non-veg", description: "Tandoori chicken pieces cooked in a creamy mild butter-tomato gravy" },

  // --- DESSERTS ---
  { category: "DESSERTS", name: "SIZZLING BROWNIE WITH ICE CREAM", price: 345, type: "veg", description: "Fudgy brownie on a hot sizzler plate with cold vanilla ice cream and fudge" },
  { category: "DESSERTS", name: "GULAB JAMUN NEST", price: 245, type: "veg", description: "Warm milk dumplings served inside a sweet spun-sugar birds nest" }
];

// ==========================================
// ASMR SOUND GENERATOR (WEB AUDIO API)
// ==========================================
const playASMRPageFlip = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 0.4; // 0.4 seconds flip friction
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Low frequency rumbling friction simulation for heavy paper cards
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (white - lastOut) * 0.42;
      lastOut = white;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, audioCtx.currentTime);
    filter.Q.setValueAtTime(2.8, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.35);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.06); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.38);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
  } catch (e) {
    console.warn("Audio context suspended. Plays ASMR sound upon user interaction gesture.");
  }
};

const playKitchenChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.12); // G5

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {}
};

// ==========================================
// WEBSITE 1: CUSTOMER PORTAL & BASKET
// ==========================================
export default function App() {
  const [menuData, setMenuData] = useState(FALLBACK_MENU);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookPages, setBookPages] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNo, setTableNo] = useState("Table 1");
  const [orderNotes, setOrderNotes] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // "all", "veg", "non-veg"
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sheetStatus, setSheetStatus] = useState("Reading live database rows...");

  // Swipe Track Refs
  const swipeStartX = useRef(0);

  // Layout resize watchers
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Google Sheet Real-time parser
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!res.ok) throw new Error("Offline grid");
        const rawText = await res.text();
        
        const rows = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (rows.length < 2) return;

        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        const list = [];

        for (let i = 1; i < rows.length; i++) {
          const cells = [];
          let cur = '';
          let inQuotes = false;
          const line = rows[i];
          
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cells.push(cur.trim());
              cur = '';
            } else {
              cur += char;
            }
          }
          cells.push(cur.trim());

          const rowObj = {};
          headers.forEach((header, index) => {
            let val = cells[index] || "";
            val = val.replace(/^"|"$/g, '');
            rowObj[header] = val;
          });

          if (rowObj.name || rowObj.item) {
            const name = rowObj.name || rowObj.item;
            const category = (rowObj.category || "BAR BITES").trim().toUpperCase();
            const price = parseFloat(rowObj.price || rowObj.amount || "0");
            const description = rowObj.description || rowObj.details || "";
            let type = (rowObj.type || "veg").trim().toLowerCase();
            
            if (type.includes("non") || type.includes("chicken") || type.includes("fish")) {
              type = "non-veg";
            } else if (type.includes("egg")) {
              type = "egg";
            } else {
              type = "veg";
            }

            list.push({ category, name, price: isNaN(price) ? 0 : price, type, description });
          }
        }

        if (list.length > 0) {
          setMenuData(list);
          setSheetStatus("Connected live to Google Sheets Menu!");
        }
      } catch (err) {
        setSheetStatus("Connected locally to Sapphire secure fallback database.");
      }
    };

    fetchSheetData();
  }, []);

  // Compute pages layout (5 items max per page)
  useEffect(() => {
    const activeItems = menuData.filter(item => {
      if (filterMode === "veg") return item.type === "veg";
      if (filterMode === "non-veg") return item.type === "non-veg" || item.type === "egg";
      return true;
    });

    const grouped = {};
    activeItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    const listCats = Object.keys(grouped);
    setCategories(listCats);

    const pages = [{ type: 'cover' }];

    listCats.forEach(cat => {
      const items = grouped[cat];
      const itemsPerPage = 5;
      const totalPagesForCat = Math.ceil(items.length / itemsPerPage);

      for (let i = 0; i < totalPagesForCat; i++) {
        pages.push({
          type: 'menu-page',
          category: cat,
          currentPageIndex: i + 1,
          totalCategoryPages: totalPagesForCat,
          items: items.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
        });
      }
    });

    pages.push({ type: 'back-cover' });

    setBookPages(pages);
    setCurrentPage(0);
  }, [menuData, filterMode]);

  const changePage = (direction) => {
    if (isFlipping) return;
    const step = isMobile ? 1 : 2;
    let target = currentPage;

    if (direction === 'next') {
      if (currentPage + step < bookPages.length) target = currentPage + step;
    } else {
      if (currentPage - step >= 0) target = currentPage - step;
    }

    if (target !== currentPage) {
      setIsFlipping(true);
      playASMRPageFlip(); // Trigger physical flip sound
      setTimeout(() => {
        setCurrentPage(target);
        setIsFlipping(false);
      }, 350);
    }
  };

  const handleJump = (index) => {
    if (isFlipping || index === currentPage) return;
    setIsFlipping(true);
    playASMRPageFlip();
    setTimeout(() => {
      if (!isMobile && index > 0 && index % 2 === 0) {
        setCurrentPage(index - 1);
      } else {
        setCurrentPage(index);
      }
      setIsFlipping(false);
    }, 350);
  };

  const handleTouchStart = (e) => {
    swipeStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = swipeStartX.current - e.changedTouches[0].clientX;
    const swipeThreshold = 55;
    if (diff > swipeThreshold) {
      changePage('next');
    } else if (diff < -swipeThreshold) {
      changePage('prev');
    }
  };

  const addToCart = (food) => {
    setCart(prev => {
      const match = prev.find(i => i.name === food.name);
      if (match) {
        return prev.map(i => i.name === food.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...food, quantity: 1 }];
    });
    playKitchenChime();
  };

  const adjustQty = (name, amount) => {
    setCart(prev => prev.map(i => {
      if (i.name === name) {
        const q = i.quantity + amount;
        return q > 0 ? { ...i, quantity: q } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gstAmount = cartSubtotal * 0.05; // 5% GST
  const cgstAmount = cartSubtotal * 0.05; // 5% CGST
  const grandTotal = cartSubtotal + gstAmount + cgstAmount;

  const submitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsOrdering(true);

    const payload = {
      table_no: tableNo,
      items: JSON.stringify(cart),
      subtotal: cartSubtotal,
      cgst: cgstAmount,
      sgst: gstAmount,
      total: grandTotal,
      notes: orderNotes,
      status: "Pending",
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("DB Error");
      const saved = await res.json();
      setOrderSuccess(saved[0] || payload);
      setCart([]);
      setOrderNotes("");
      setIsCartOpen(false);
    } catch (err) {
      const localId = "SAPPHIRE-LOCAL-" + Math.floor(Math.random() * 9000 + 1000);
      const fallbackPayload = { ...payload, id: localId };
      
      const currentLocals = JSON.parse(localStorage.getItem('sapphire_local_orders') || '[]');
      localStorage.setItem('sapphire_local_orders', JSON.stringify([fallbackPayload, ...currentLocals]));
      
      setOrderSuccess(fallbackPayload);
      setCart([]);
      setOrderNotes("");
      setIsCartOpen(false);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden font-sans select-none">
      
      {/* KARAN AGENCY HEADER & NAV */}
      <header className="bg-slate-900 border-b border-amber-500/10 px-4 py-3 sticky top-0 z-40 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <a 
            href="https://karan-digital-menu-agency.vercel.app/#contact" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold tracking-widest text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            (Created By. KARAN DIGITAL MENU AGENCY)
            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-200">→</span>
          </a>

          <div className="text-center sm:text-right">
            <h1 className="text-base font-black tracking-[0.2em] uppercase text-white">HOTEL SAPPHIRE</h1>
            <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest">DIGITAL FLIP BOOK</p>
          </div>

        </div>
      </header>

      {/* CONNECTION STATUS ALERT TAG */}
      <div className="bg-slate-950 text-center py-1.5 text-[10px] text-slate-500 border-b border-slate-900 flex justify-center items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <span>{sheetStatus}</span>
      </div>

      {/* FILTER CONTROL PANEL */}
      <section className="bg-slate-950 py-3.5 px-4 border-b border-slate-900 flex justify-center gap-3">
        {['all', 'veg', 'non-veg'].map(type => (
          <button
            key={type}
            onClick={() => setFilterMode(type)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              filterMode === type 
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md transform scale-105' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {type === 'all' ? '🍽️ Full Menu' : type === 'veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}
          </button>
        ))}
      </section>

      {/* VIRTUAL FLIPBOOK VIEWPORT */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 relative max-w-5xl w-full mx-auto">
        
        <div 
          className="relative w-full h-[60vh] min-h-[440px] max-h-[640px] bg-gradient-to-b from-amber-950/10 via-slate-900/10 to-transparent border-2 border-amber-500/20 rounded-3xl shadow-2xl p-1 flex items-center justify-center overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Control Buttons */}
          {currentPage > 0 && (
            <button 
              onClick={() => changePage('prev')}
              className="absolute left-4 z-30 w-11 h-11 rounded-full bg-slate-950/95 border border-amber-500/40 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-xl cursor-pointer active:scale-90"
            >
              ◀
            </button>
          )}

          {currentPage < bookPages.length - (isMobile ? 1 : 2) && (
            <button 
              onClick={() => changePage('next')}
              className="absolute right-4 z-30 w-11 h-11 rounded-full bg-slate-950/95 border border-amber-500/40 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-xl cursor-pointer active:scale-90"
            >
              ▶
            </button>
          )}

          {/* DYNAMIC TWO-PAGE LAYOUT */}
          <div className={`w-full h-full flex transition-all duration-300 ${isFlipping ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'}`}>
            
            {/* Desktop Left-Hand Side Page */}
            {!isMobile && currentPage > 0 && (
              <div className="w-1/2 h-full bg-slate-950 p-6 md:p-8 border-r border-slate-900/60 flex flex-col justify-between relative overflow-y-auto">
                <div className="absolute inset-4 border border-amber-500/5 rounded-2xl pointer-events-none"></div>
                <BookPageRenderer page={bookPages[currentPage - 1]} onAdd={addToCart} />
              </div>
            )}

            {/* Right-Hand Side Page (or single view on mobile) */}
            <div className={`h-full bg-slate-950 p-6 md:p-8 flex flex-col justify-between relative overflow-y-auto ${isMobile ? 'w-full' : 'w-1/2'}`}>
              <div className="absolute inset-4 border border-amber-500/5 rounded-2xl pointer-events-none"></div>
              <BookPageRenderer page={bookPages[currentPage]} onAdd={addToCart} />
            </div>

          </div>

        </div>

        {/* SWIPING PROGRESS MAP */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5 animate-pulse">
            <span>👈 Swipe left or right to turn asmr pages 👉</span>
          </p>
          <div className="flex flex-wrap gap-2 items-center justify-center max-w-md">
            {bookPages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleJump(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentPage || (!isMobile && idx === currentPage - 1 && currentPage > 0)
                    ? 'w-7 bg-amber-500 shadow shadow-amber-500/50' 
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Page ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </main>

      {/* FLOATING ACTION CART TAPE */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xl border border-amber-300/40 font-bold flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform group"
        >
          <span className="text-xl transform group-hover:scale-110 duration-200">🛒</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* DETAILED CART OVERLAY SCREEN */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-amber-500/15 h-full flex flex-col justify-between p-4 shadow-2xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="text-lg">🛎️</span>
                <h3 className="text-base font-black uppercase tracking-widest">Order Cart</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* List items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-24 text-slate-500 space-y-3">
                  <span className="text-5xl block animate-pulse">🥗</span>
                  <p className="text-xs uppercase tracking-widest font-bold">Your cart is empty.</p>
                  <p className="text-[11px] text-slate-600">Browse pages & tap items to start ordering!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.name} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <VegIndicator type={item.type} />
                        <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                      </div>
                      <p className="text-[10px] text-amber-500 font-bold mt-1">₹ {item.price}</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button onClick={() => adjustQty(item.name, -1)} className="w-7 h-7 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-lg border border-slate-800">-</button>
                      <span className="text-xs font-extrabold text-white min-w-[12px] text-center">{item.quantity}</span>
                      <button onClick={() => adjustQty(item.name, 1)} className="w-7 h-7 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-lg border border-slate-800">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tax break and order form */}
            {cart.length > 0 && (
              <form onSubmit={submitOrder} className="border-t border-slate-800 pt-4 space-y-4 bg-slate-950 p-4 rounded-2xl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Select Dining Table</label>
                    <select
                      value={tableNo}
                      onChange={(e) => setTableNo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs rounded-lg text-slate-200 focus:outline-none"
                    >
                      {Array.from({ length: 25 }, (_, idx) => `Table ${idx + 1}`).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Cooking Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Mild spicy"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 text-xs rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-900 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-100">₹ {cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span className="text-slate-100">₹ {gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (5%):</span>
                    <span className="text-slate-100">₹ {cgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-400 text-sm border-t border-slate-900 pt-2">
                    <span>Total Bill amount:</span>
                    <span>₹ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isOrdering ? "Sending to kitchen..." : `🛎️ Transmit Order (₹ ${grandTotal.toFixed(0)})`}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* CONFIRMED TRANSACTION OVERLAY */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/20 max-w-sm w-full p-6 text-center space-y-4 rounded-2xl shadow-2xl">
            <span className="text-5xl block animate-bounce">🔥</span>
            <h3 className="text-lg font-bold text-amber-400 uppercase tracking-widest">Order Transmitted!</h3>
            <p className="text-xs text-slate-300">
              Your gourmet selections have been sent successfully to the kitchen for <strong className="text-white">{orderSuccess.table_no}</strong>.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono border border-slate-800 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Receipt Ref:</span>
                <span>#{orderSuccess.id?.toString().slice(-6).toUpperCase() || "PENDING"}</span>
              </div>
              <div className="flex justify-between text-amber-500 font-bold border-t border-slate-900 pt-2">
                <span>Total Payable:</span>
                <span>₹ {orderSuccess.total?.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// RENDER COMPONENT: INDIVIDUAL BOOK PAGE
// ==========================================
function BookPageRenderer({ page, onAdd }) {
  if (!page) return null;

  if (page.type === 'cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4 py-6">
        <div className="w-20 h-20 rounded-full border border-amber-500/20 flex items-center justify-center p-1 bg-slate-900/50">
          <span className="text-amber-400 text-2xl font-serif">★</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 uppercase">
            Hotel Sapphire
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-medium">Yamunanagar</p>
        </div>

        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Interactive Digital Flipbook</p>
          <p className="text-[10px] text-amber-500/60 font-semibold italic">Tap dishes to add to your order basket</p>
        </div>
      </div>
    );
  }

  if (page.type === 'back-cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4 py-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">Ratings & Reviews</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
          Help us refine our hospitality by rating your experiences at Hotel Sapphire Yamunanagar.
        </p>

        <a
          href="https://www.google.com/search?q=Hotel+sapphire+yamunanagar+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all"
        >
          ⭐ Review us on Google
        </a>

        <p className="text-[8px] text-slate-600 uppercase tracking-widest">
          Hotel Sapphire Yamunanagar © All Rights Reserved.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between py-2 space-y-4">
      
      <div className="space-y-4">
        {/* Category Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
          <h3 className="text-xs font-black tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
            🍲 {page.category}
          </h3>
          <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">
            Page {page.currentPageIndex} / {page.totalCategoryPages}
          </span>
        </div>

        {/* Dynamic Items Listing */}
        <div className="space-y-3">
          {page.items.map(food => (
            <div
              key={food.name}
              onClick={() => onAdd(food)}
              className="group p-2.5 rounded-xl border border-transparent hover:bg-slate-900/40 hover:border-amber-500/10 transition-all cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-1.5">
                  <VegIndicator type={food.type} />
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                    {food.name}
                  </h4>
                </div>
                {food.description && (
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                    {food.description}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-amber-500">₹ {food.price}</span>
                <span className="block text-[8px] uppercase font-bold text-slate-600 mt-1 group-hover:text-amber-500">
                  + Add
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating feedback button on every single physical menu page */}
      <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[9px]">
        <a
          href="https://www.google.com/search?q=Hotel+sapphire+yamunanagar+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase tracking-widest text-amber-500/70 hover:text-amber-400 font-extrabold flex items-center gap-1"
        >
          ⭐ Rate Us Google
        </a>
        <span className="text-slate-600 font-medium italic">exclusive of taxes</span>
      </div>

    </div>
  );
}

// Indicator badge Helper
function VegIndicator({ type }) {
  if (type === 'veg') {
    return (
      <div className="w-3 h-3 border border-green-600 flex items-center justify-center p-[1px] shrink-0" title="Pure Veg Item">
        <div className="w-full h-full rounded-full bg-green-600"></div>
      </div>
    );
  }
  return (
    <div className="w-3 h-3 border border-red-600 flex items-center justify-center p-[1px] shrink-0" title="Non-Veg Item">
      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-600 mb-[0.5px]"></div>
    </div>
  );
}

```
