import React, { useEffect, useState } from "react";
import ScoreCard from "../../../assets/image/ScoreCardMen.png";

export default function CopilotScoreCardNotes() {
  const [scoreCards, setScoreCards] = useState("");
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/myscore_card`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.info(data);
        setScoreCards(data);
      })
      .catch((err) => console.info(err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {scoreCards[0] ? (
        scoreCards.map((card) => (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${card.photo_user}`}
            alt="Score Card"
            className="w-60 h-70 md:w-[500px] md:h-auto top-0 left-48 pb-4"
          />
        ))
      ) : (
        <img
          src={ScoreCard}
          alt="Score Card"
          className="w-60 h-70 md:w-[500px] md:h-auto top-0 left-48"
        />
      )}
    </div>
  );
}
