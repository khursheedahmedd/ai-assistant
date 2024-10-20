import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PictureMode from './pages/PictureMode';
import TranslationMode from './pages/TranslationMode';
import AssistantMode from './pages/AssistantMode';
import HealthMode from './pages/HealthMode';
import LearnMode from './pages/LearnMode';
import SpeechMode from './pages/SpeechMode';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      {/* <HomePage /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/picture-mode" element={<PictureMode />} />
        <Route path="/language-translation" element={<TranslationMode />} />
        <Route path="/assistant-mode" element={<AssistantMode />} />
        <Route path="/health-mode" element={<HealthMode />} />
        // <Route path="/learn-mode" element={<LearnMode />} />
        <Route path="/speak-mode" element={<SpeechMode />} />
      </Routes>
    </Router>
  );
}

export default App;
