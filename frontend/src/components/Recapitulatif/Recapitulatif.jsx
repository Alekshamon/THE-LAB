/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types

export default function Recapitulatif({ selectedEvent, selectedFormula }) {
  const { city, address, date } = selectedEvent || {};
  const { price, title } = selectedFormula || {};
  const handleCheckout = async () => {
    try {
      // Utilisez l'URL de l'environnement pour faire l'appel API
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: selectedFormula.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de paiement:",
        error
      );
    }
  };

  return (
    <>
      <div className="text-white border-2 border-red-600 my-8 flex flex-col p-4 items-start center">
        <h1 className="self-center">Recapitulatif</h1>
        <p>Vous avez choisi de participer a l'événement : {city}</p>
        <p>Adresse du Stade : {address}</p>
        <p>
          Date de l'événement :{" "}
          {new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>Formule Choisie : {title}</p>
        <p>Prix : {price} €</p>
        <div className="flex flex-row gap-2">
          <p>Code Promo : </p> &nbsp;
          <input type="text" className="rounded" />
          <button className="bg-red-600 text-white rounded px-2">
            Utiliser
          </button>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="bg-red-600 text-white rounded px-2 mb-4"
      >
        Passer Au Paiement
      </button>
    </>
  );
}
