/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AddDiscountModal from "./AddPromoCode";
import DiscountInfoModal from "./DiscountInfoModal";

export default function PromoCode() {
  const [promoCode, setPromoCode] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    success: false,
  });

  const discountPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discount`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPromoCode(data);
      })
      .catch((err) => console.info(err));
  }, [notification.message]);
  const nextPage = () => {
    setCurrentPage((prevPages) => prevPages + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPages) => prevPages - 1);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  function openModal(promoCodes) {
    setSelectedDiscount(promoCodes);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const filteredDiscount = promoCode?.filter((reduc) =>
    Object.values(reduc).some(
      (value) =>
        value !== null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * discountPerPage;
  const indexOfFirstUser = indexOfLastUser - discountPerPage;
  const currentDiscount = filteredDiscount?.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  return (
    <div className="flex flex-col items-center w-full lg:pt-10">
      <h1 className="text-center text-[30px] font-primary-font">
        Tous les Codes Promos
      </h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-80 text-black rounded-lg p-2 m-5"
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={openAddModal}
          className="bg-[#544b5d] rounded-lg hover:bg-gray-300 p-2"
        >
          Ajouter un code promo
        </button>
        {isAddModalOpen && (
          <AddDiscountModal
            isOpen={isAddModalOpen}
            onRequestClose={closeAddModal}
            notification={notification}
            setNotification={setNotification}
          />
        )}
      </div>
      <div className="md:mx-10 overflow-x-auto my-5">
        <div className="flex flex-col ">
          <div className="px-4 py-2 flex justify-between gap-3 pointer  bg-[#5b4f67]">
            <p className="w-32 text-center">Nom</p>
            <p className="w-32 text-center hidden md:block ">Pourcentage</p>
            <p className="md:w-32 text-center hidden md:block">Quantité</p>
            <p className="md:w-32 text-center hidden md:block">
              Date de validité
            </p>
            <p className="w-32 text-center">Status</p>
          </div>
          {currentDiscount
            ?.filter((discount) =>
              discount.promo_code
                .toLowerCase()
                .includes(searchTerm?.toLowerCase())
            )
            .map((discounts, index) => (
              <button
                key={discounts.id}
                onClick={() => openModal(discounts)}
                className={`px-4 py-2 flex justify-between gap-3 pointer ${index % 2 === 0 ? "bg-background-color-second" : "bg-[#5b4f67]"}`}
              >
                <p className="w-32 text-center">{discounts.promo_code}</p>
                <p className="w-32 text-center hidden md:block">
                  {discounts.percent_value} %
                </p>
                <p className="md:w-32 text-center hidden md:block">
                  {discounts.quantity}
                </p>
                <p className="md:w-32 text-center hidden md:block">
                  {format(new Date(discounts.duree_de_validite), "dd/MM/yyyy", {
                    locale: fr,
                  })}
                </p>
                {discounts.status ? (
                  <p className="w-32 text-center">Actif</p>
                ) : (
                  <p className="w-32 text-center">Inactif</p>
                )}
              </button>
            ))}
        </div>
        <DiscountInfoModal
          isOpen={isModalOpen}
          // eslint-disable-next-line react/jsx-no-bind
          onRequestClose={closeModal}
          promoCode={selectedDiscount}
        />
      </div>
      <div className="flex justify-between m-4 gap-5 ">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-background-color-second text-white rounded pointer "
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentDiscount?.length < discountPerPage}
          className="py-2 px-8 bg-background-color-second text-white rounded pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
