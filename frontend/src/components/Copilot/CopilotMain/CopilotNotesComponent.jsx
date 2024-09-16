/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";

export default function CopilotNotesComponent() {
  const [notes, setNotes] = useState([]);
  const { user } = useContext(UserContext);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/mynote`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h2 className="text-2xl font-primary-font mb-4">Mes notes</h2>
      <div className="flex flex-wrap justify-center gap-4 mx-10">
        {notes.length === 0 ? (
          <>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">PHY</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">VIT</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">PAS</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">TIR</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">DRI</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">VIS</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">CF</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">PLO</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400">DEG</span>
            </div>
            <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
              <span className="text-[16px] font-bold">0</span>
              <span className="text-violet-400"> BAF</span>
            </div>
          </>
        ) : (
          notes.map((note, index) => (
            <>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_physique || "0"}
                  </span>
                  <span className="text-violet-400">PHY</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_vitesse || "0"}
                  </span>
                  <span className="text-violet-400">VIT</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_passe || "0"}
                  </span>
                  <span className="text-violet-400">PAS</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_tir || "0"}
                  </span>
                  <span className="text-violet-400">TIR</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_dribble || "0"}
                  </span>
                  <span className="text-violet-400">DRI</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_vista || "0"}
                  </span>
                  <span className="text-violet-400">VIS</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste === "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_cf || "0"}
                  </span>
                  <span className="text-violet-400">CF</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste !== "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_plongeon || "0"}
                  </span>
                  <span className="text-violet-400">PLO</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste !== "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_arrets || "0"}
                  </span>
                  <span className="text-violet-400">ARR</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div
                  className={`rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col ${user.data.poste !== "gardien" && "hidden"}`}
                >
                  <span className="text-[16px] font-bold">
                    {note.note_dega || "0"}
                  </span>
                  <span className="text-violet-400">DEG</span>
                </div>
              </React.Fragment>
              <React.Fragment key={index}>
                <div className="rounded-full border-white border-2 bg-background-color-second text-white w-16 h-16 md:w-20 md:h-20 flex justify-center items-center flex-col">
                  <span className="text-[16px] font-bold">
                    {note.note_pied_faible || "0"}
                  </span>
                  <span className="text-violet-400"> PF</span>
                </div>
              </React.Fragment>
            </>
          ))
        )}
      </div>
    </div>
  );
}
