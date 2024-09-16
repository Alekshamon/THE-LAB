/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from "react";

export default function CopilotNoteGen() {
  const [noteGen, setNoteGen] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/mynote`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Récupération des valeurs des notes de l'index 1 à 11
        const notes = Object.values(data[0]).slice(1, 12);
        const filterNotes = notes.filter((note) => note !== null);
        // Calcul du total des notes
        const totalNotes = filterNotes.reduce((acc, note) => acc + note, 0);
        // Calcul de la moyenne
        const moyenne = totalNotes / filterNotes.length;

        // Mise à jour de l'état de la moyenne
        setNoteGen(parseInt(moyenne, 10));
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="font-primary-font text-center p-4 text-2xl">
        <span>Ma note générale</span>
      </div>
      {noteGen !== null ? (
        <div className="rounded-xl border-2 border-white bg-background-color-second text-white w-52 h-52 flex justify-center items-center flex-col">
          <span className="text-4xl font-bold">{noteGen}</span>
        </div>
      ) : (
        <div className="rounded-xl bg-background-color-second text-white w-52 h-52 flex justify-center items-center flex-col">
          <span className="text-4xl font-bold">00.00</span>
        </div>
      )}
    </div>
  );
}
