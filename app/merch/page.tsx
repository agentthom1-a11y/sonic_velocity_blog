'use client';

import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MerchPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </Link>

      <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-6">
                  <ShoppingBag className="w-3 h-3 text-neutral-400" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Supply Depot</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Merch</h1>
              <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Official Velocity Hardware & Apparel</p>
          </div>
          <div className="text-right hidden md:block">
               <p className="font-mono text-xs text-neutral-600 mb-2">STATUS: RESTOCKED</p>
               <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-green-500"></div>
               </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
              { 
                  id: "ITEM_01",
                  name: "Velocity Core Tee",
                  price: "Rp 350.000",
                  type: "Apparel",
                  color: "bg-neutral-900"
              },
              { 
                  id: "ITEM_02",
                  name: "Neural Hoodie [Black]",
                  price: "Rp 650.000",
                  type: "Apparel",
                  color: "bg-black"
              },
              { 
                  id: "ITEM_03",
                  name: "System Cap v1",
                  price: "Rp 250.000",
                  type: "Accessory",
                  color: "bg-neutral-800"
              },
              { 
                  id: "ITEM_04",
                  name: "Koplo Syntax Vinyl",
                  price: "Rp 450.000",
                  type: "Physical Media",
                  color: "bg-neutral-950"
              }
          ].map((item, i) => (
              <div key={i} className="group border border-neutral-800 bg-black p-4 hover:border-neutral-600 transition-all flex flex-col justify-between h-full">
                  <div>
                      <div className={`aspect-square ${item.color} border border-neutral-800 mb-4 relative overflow-hidden flex items-center justify-center`}>
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:10px_10px]"></div>
                          <div className="relative z-10 text-neutral-700 font-black text-6xl opacity-20 group-hover:opacity-40 transition-opacity">V</div>
                          
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm border border-neutral-800">
                              <span className="text-[8px] font-mono text-neutral-400 uppercase">{item.id}</span>
                          </div>
                      </div>
                      
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-white transition-colors">{item.name}</h3>
                              <p className="text-[10px] font-mono text-neutral-500 uppercase">{item.type}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-neutral-800 pt-3 mt-4">
                      <span className="text-sm font-mono text-white">{item.price}</span>
                      <button className="p-2 bg-white text-black hover:bg-neutral-200 transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
