"use client";

import React, { useState } from "react";

export default function FlashSalesPage() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSave = () => {
    console.log("Saving Flash Sale:", { startTime, endTime });
    // API logic here
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Flash Sale Management</h1>
      
      <div className="bg-neutral-900 p-6 rounded-lg shadow border border-neutral-800">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-semibold">Start Time</label>
            <input
              type="datetime-local"
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">End Time</label>
            <input
              type="datetime-local"
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Select Products for Sale</label>
          {/* A simple placeholder select or multiselect */}
          <select multiple className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none h-32">
            <option value="1">Cyber Jacket</option>
            <option value="2">Neon Sneakers</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Schedule Flash Sale
          </button>
        </div>
      </div>
    </div>
  );
}
