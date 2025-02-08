"use client";
import { useState, useEffect } from 'react';
import Body from "@/components/Body";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Olympic from "@/components/Olympic";

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    setAuth(storedAuth ? storedAuth : null);
  }, []);

  const handleSetAuth = (username) => {
    setAuth(username);
    localStorage.setItem("auth", username);
  };

  const handleLogout = () => {
    setAuth(null);
    setCurrentView('home');
    localStorage.removeItem("auth");
  };

  const handleNavClick = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Header onNavClick={handleNavClick} auth={auth} setAuth={handleSetAuth} onLogout={handleLogout} />
      <main className="flex-grow pt-16">
        {auth ? (
          currentView === 'home' ? <Body /> :
          currentView === 'olympics2024'?<Olympic/> :
          <Body />
        ) : (
          <Body />
        )}
      </main>
      <Footer />
    </div>
  );
}
