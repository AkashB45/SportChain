"use client";

import { useState } from "react";

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const sections = [
    {
      title: "What is SportsChain?",
      content:
        "SportChain is a blockchain-powered sports event platform that enables secure registrations, NFT certificates, and verified organizers.",
    },
    {
      title: "How do I register for an event?",
      content:
        "Browse events → Click Register → Complete payment (if required) → Receive confirmation email.",
    },
    {
      title: "How do NFT certificates work?",
      content:
        "Certificates are minted on blockchain after attendance confirmation and sent to your registered email and wallet.",
    },
    {
      title: "Why can't organizers register?",
      content:
        "Organizers cannot register for events to prevent role conflict and maintain system integrity.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Help Center
        </h1>

        <div className="space-y-4 mt-12">
          {sections.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 cursor-pointer hover:shadow-purple-500/30 hover:shadow-lg transition-all"
              onClick={() => toggle(index)}
            >
              <h2 className="text-xl font-semibold flex justify-between">
                {item.title}
                <span>{open === index ? "−" : "+"}</span>
              </h2>
              {open === index && (
                <p className="mt-4 text-gray-300">{item.content}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-gray-400">
          Need more help? Contact akashbalaji594@gmail.com
        </div>
      </div>
    </div>
  );
}