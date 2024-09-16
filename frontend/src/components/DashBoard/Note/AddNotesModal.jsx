/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import Modal from "react-modal";
import { UserContext } from "../../../context/UserContext";

export default function AddEventModal({ isOpen, onRequestClose }) {
  const { token } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCharacteristic, setSelectedCharacteristic] = useState("");
  const [userNotes, setUserNotes] = useState([]);
  const [note, setNote] = useState("");
  const [eventUsers, setEventUsers] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    success: false,
  });

  useEffect(() => {
    Modal.setAppElement("#root");
    // Récupération de la liste des événements depuis l'API
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`)
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(filtered);
      })
      .catch((error) => console.error("Error:", error));
    // Récupération des utilisateurs associés à l'événement sélectionné depuis l'API
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stockEvent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.filter(
          (user) => user.event_id === parseInt(selectedEvent, 10)
        );
        setEventUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Récupération des notes utilisateur depuis l'API
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/note`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserNotes(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectedEvent, notification.message]);

  const handleNoteChange = (event) => {
    // Mise à jour de la note lors de la saisie dans le champ de texte
    const { value } = event.target;
    setNote(value);
  };

  // Fonction pour soumettre la note
  const handleSubmit = (event) => {
    event.preventDefault();
    // Vérification si tous les champs nécessaires sont remplis
    if (!selectedEvent || !selectedUser || !note) {
      showNotification(
        "Error, veuillez remplir tous les champs et réessayer",
        false
      );
      return;
    }

    const filterNoteUser = userNotes.filter(
      (notess) => parseInt(notess.user_id, 10) === parseInt(selectedUser, 10)
    );

    // Construction de l'URL et de la méthode de requête
    const url = filterNoteUser.length
      ? `${import.meta.env.VITE_BACKEND_URL}/api/note/${selectedUser}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/note/`;
    const method = filterNoteUser.length ? "PUT" : "POST";

    // Envoi de la requête pour ajouter ou mettre à jour la note
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        [selectedCharacteristic]: note,
        user_id: selectedUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Affichage de la notification de succès
        showNotification("Note ajoutée avec succès", true);
        // Réinitialisation des champs et fermeture du modal
        setSelectedUser("");
        setSelectedCharacteristic("");
        setNote("");
        // onRequestClose();
      })
      .catch((error) => {
        // Affichage de la notification d'erreur
        showNotification(
          "Erreur lors de l'ajout ou de la mise à jour de la note",
          false
        );
        console.error("Error:", error);
      });
  };

  const handleEventChange = (e) => {
    // Mise à jour de l'événement sélectionné
    setSelectedEvent(e.target.value);
  };

  const handleUserChange = (e) => {
    // Mise à jour de l'utilisateur sélectionné
    setSelectedUser(e.target.value);
  };

  const handleCharacteristicChange = (e) => {
    // Mise à jour de la caractéristique sélectionnée
    setSelectedCharacteristic(e.target.value);
  };

  // Fonction pour afficher la notification et la cacher après 2 secondes
  const showNotification = (message, success) => {
    setNotification({ message, success });

    // Masquer la notification après 2 secondes
    setTimeout(() => {
      setNotification({ message: "", success: false });
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Ajouter des notes"
      className="absolute top-1/2 left-1/2 right-auto bottom-auto mr-[-50%] transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[25rem] lg:w-[40rem] text-[8px] text-center bg-[#281f31] text-white p-4 rounded-lg font-secondary-font"
    >
      <button className="flex " onClick={onRequestClose}>
        <ImCross />
      </button>
      <h2 className="text-2xl font-bold mb-4">Ajouter des notes</h2>
      <label>
        <span className="text-white text-[20px] font-secondary-font">
          Evénement:
          <select
            className="w-72 md:w-80 m-8  text-background-color-second"
            onChange={handleEventChange}
          >
            <option value="">Sélectionnez un événement</option>
            {events.map((event) => (
              <option className="text-xs" key={event.id} value={event.id}>
                {event.city} {new Date(event.date).toLocaleDateString("fr-FR")}{" "}
                {event.address}
              </option>
            ))}
          </select>
        </span>
      </label>
      <hr className="mb-4" />
      <label>
        <span className="text-white text-[20px] font-secondary-font">
          Participant:
          <select
            className="w-72 md:w-80 m-8 text-background-color-second"
            onChange={handleUserChange}
            value={selectedUser}
          >
            <option>Sélectionnez un participant</option>
            {eventUsers.map((user) => (
              <option className="text-xs" key={user.id} value={user.user_id}>
                {user.lastname} {user.firstname} {user.email}
              </option>
            ))}
          </select>
        </span>
      </label>
      <hr className="mb-4" />
      <label>
        <span className="text-white text-[20px] font-secondary-font">
          Caractéristique:
          <select
            className="w-72 md:w-80 m-8 text-background-color-second"
            onChange={handleCharacteristicChange}
            value={selectedCharacteristic}
          >
            <option className="text-xs" value="">
              Sélectionnez une caractéristique
            </option>
            <option className="text-xs" value="note_physique">
              Note physique
            </option>
            <option className="text-xs" value="note_vitesse">
              Note vitesse
            </option>
            <option className="text-xs" value="note_passe">
              Note passe
            </option>
            <option className="text-xs" value="note_tir">
              Note tir
            </option>
            <option className="text-xs" value="note_dribble">
              Note dribble
            </option>
            <option className="text-xs" value="note_vista">
              Note vista
            </option>
            <option className="text-xs" value="note_cf">
              Note cf
            </option>
            <option className="text-xs" value="note_plongeon">
              Note plongeon
            </option>
            <option className="text-xs" value="note_arrets">
              Note arrets
            </option>
            <option className="text-xs" value="note_dega">
              Note dega
            </option>
            <option className="text-xs" value="note_pied_faible">
              Note pied faible
            </option>
          </select>
        </span>
      </label>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 text-black gap-4"
      >
        <span className="text-white text-[20px] font-secondary-font">
          Note :
        </span>
        <input
          type="text"
          name={selectedCharacteristic}
          placeholder="Note"
          value={note}
          onChange={handleNoteChange}
          className="w-[70px] p-2 rounded-lg text-sm"
        />
        <button
          type="submit"
          className="bg-[#544b5d] hover:bg-gray-300 w-[80px] h-[30px] text-base rounded-lg text-white"
        >
          Ajouter
        </button>
      </form>
      {notification.message && (
        <div
          data-aos="fade-right"
          data-aos-duration="3500"
          className={`fixed bottom-4 right-4 px-5 sm:px-10 py-2 rounded-lg flex items-center ${
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
    </Modal>
  );
}

AddEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
