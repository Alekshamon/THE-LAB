/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types

/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Recapitulatif({ selectedEvent }) {
  const navigate = useNavigate();
  const { city, address, date } = selectedEvent || {};
  const [notification, setNotification] = useState({
    message: "",
    success: false,
  });

  const showNotification = (message, success) => {
    setNotification({ message, success });
    setTimeout(() => {
      navigate("/copilot");
      setNotification({ message: "", success: false });
    }, 2000);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/stockEvent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            event_id: selectedEvent?.id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.info("Success:", data);
        showNotification("Inscription réussie !", true);
      } else {
        const errorData = await response.json();
        showNotification(
          `Erreur : ${errorData.error || "Une erreur est survenue"}`,
          false
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription à l'événement:", error);
      showNotification(
        "Erreur lors de l'inscription. Vérifiez les informations et réessayez.",
        false
      );
    }
  };

  return (
    <>
      <div className="text-white border-2 border-red-600 my-8 flex flex-col p-4 items-start center">
        <h1 className="self-center">Récapitulatif</h1>
        <p>Vous avez choisi de participer à l'événement : {city}</p>
        <p>Adresse du Stade : {address}</p>
        <p>
          Date de l'événement :{" "}
          {new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <button
        onClick={handleCheckout}
        className="bg-red-600 text-white rounded px-2 mb-4"
      >
        Confirmer l'inscription
      </button>

      {notification.message && (
        <div
          className={`fixed bottom-4 right-4 px-5 py-2 rounded-lg flex items-center ${
            notification.success ? "bg-green-500" : "bg-red-500"
          } text-white text-sm`}
        >
          {notification.success ? (
            <IoCheckmarkDoneCircle className="mr-2" />
          ) : (
            <MdErrorOutline className="mr-2" />
          )}
          {notification.message}
        </div>
      )}
    </>
  );
}
