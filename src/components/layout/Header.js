import React from 'react';
import { BookOpen } from 'lucide-react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8" />
          <h1 className="text-2xl font-bold">ReadingPal</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="https://github.com/HkaanUsta/ai-speech-to-text-analyze-fe" target="_blank" className="hover:text-blue-200 transition-colors">Frontend</a>
          <a href="https://github.com/HkaanUsta/ai-speech-to-text-analyze-be" target="_blank" className="hover:text-blue-200 transition-colors">Backend</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;