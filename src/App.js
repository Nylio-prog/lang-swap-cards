import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// import './firebaseConfig'; // Add this line prevent firebase not loading error
// import { getFirestore, addDoc, collection } from "firebase/firestore";

import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Decks from "./components/Decks";
import DeckEdit from "./components/DeckEdit";
import DeckView from "./components/DeckView";
import CardEdit from "./components/CardEdit";
import Practice from "./components/Practice";
import PracticeDeck from "./components/PracticeDeck";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user =
      storedUser !== "undefined" ? JSON.parse(storedUser) : undefined;

    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="decks" element={<Decks />} />
      <Route path="decks/:deckId" element={<DeckView />} />
      <Route path="decks/new" element={<DeckEdit />} />
      <Route path="card/edit" element={<CardEdit />} />
      <Route path="practice" element={<Practice />} />
      <Route path="practice/:deckId" element={<PracticeDeck />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
