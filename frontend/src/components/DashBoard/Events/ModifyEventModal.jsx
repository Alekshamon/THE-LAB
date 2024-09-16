/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from "react";
import Modal from "react-modal";
import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

Modal.setAppElement("#root"); // This line is needed for accessibility reasons

export default function EditEventModal({
  isOpen,
  onRequestClose,
  eventData,
  onUpdateEvent,
  notification,
}) {
  const [formData, setFormData] = useState(
    {
      id: eventData.id,
      city: eventData.city,
      date: format(new Date(eventData.date), "yyyy-MM-dd", {
        locale: fr,
      }),
      address: eventData.address,
      quantity: eventData.quantity,
      created_at: eventData.created_at,
      updated_at: eventData.updated_at,
      status: "active",
    } || {}
  );
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateEvent(formData);
    setTimeout(() => {
      onRequestClose();
    }, 1000);
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modifier un événement"
      className="absolute top-1/2 left-1/2 right-auto bottom-auto mr-[-50%] transform -translate-x-1/2 -translate-y-1/2 md:w-[25rem] lg:w-[40rem] text-[8px] text-center bg-[#281f31] text-white p-4 rounded-lg font-secondary-font"
    >
      <button className="flex " onClick={onRequestClose}>
        <ImCross />
      </button>
      <h2 className="text-2xl font-bold mb-4">Modifier un événement</h2>
      <p className="text-xs mb-4">Veuillez modifier les champs suivants :</p>
      <hr className="mb-4" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between items-center text-black gap-4"
      >
        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={formData.city}
          onChange={handleChange}
          className="w-[200px] p-2 rounded-lg text-sm"
        />
        <input
          type="date"
          name="date"
          value={format(new Date(formData.date), "yyyy-MM-dd", {
            locale: fr,
          })}
          onChange={handleChange}
          className="w-[200px] p-2 rounded-lg text-sm"
        />
        {}

        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={formData.address}
          onChange={handleChange}
          className="w-[200px] p-2 rounded-lg text-sm"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantité"
          value={formData.quantity}
          onChange={handleChange}
          className="w-[200px] p-2 rounded-lg text-sm"
        />
        <button
          type="submit"
          className="bg-[#544b5d] hover:bg-gray-300 w-[90px] h-[30px] text-base rounded-lg text-white"
        >
          Enregistrer
        </button>
      </form>
      {notification.message && (
        <div
          data-aos="fade-right"
          data-aos-duration="3500"
          className={`fixed bottom-4 right-4 px-5 sm:px-5 py-2 rounded-lg flex items-center ${
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

EditEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  eventData: PropTypes.shape({
    city: PropTypes.string,
    date: PropTypes.string,
    address: PropTypes.string,
    quantity: PropTypes.number,
  }).isRequired,
  onUpdateEvent: PropTypes.func.isRequired,
};
