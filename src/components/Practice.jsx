import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Practice = () => {
  const [decks, setDecks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user =
      storedUser !== "undefined" ? JSON.parse(storedUser) : undefined;

    if (!user) {
      navigate("/login");
    } else {
      // Fetch decks only if the user is present
      const fetchDecks = async () => {
        try {
          // Get the reference to the 'decks' collection
          const decksCollection = collection(db, "decks");

          const q = query(
            decksCollection,
            where("users_id", "array-contains", user.uid)
          );

          // Execute the query to get all decks
          const decksSnapshot = await getDocs(q);

          // Map the documents to an array of deck objects
          const decksData = decksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Update the state with the fetched decks
          setDecks(decksData);
          console.log(decksData);
        } catch (error) {
          console.error("Error fetching decks:", error);
        }
      };

      // Example usage
      fetchDecks();
    }
  }, [navigate]);

  const handleDeckClick = (deck) => {
    navigate(`/practice/${deck.id}`);
  };

  return (
    <div className="Decks">
      <h2>Your decks</h2>
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="deck-box"
          onClick={() => handleDeckClick(deck)}
        >
          <p>{deck.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Practice;
