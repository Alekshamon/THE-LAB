import React, { useEffect, useState } from "react";
import PaymentInfoModal from "./PaymentInfoModal";

export default function Payment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, setPayment] = useState();
  const paymentPerPage = 10;
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.info(data);
        setPayment(data);
      })
      .catch((err) => console.info(err));
  }, []);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const nextPage = () => {
    setCurrentPage((prevPages) => prevPages + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPages) => prevPages - 1);
  };

  function openModal(payments) {
    setSelectedPayment(payments);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const filteredPayment = payment?.filter((pay) =>
    Object.values(pay).some(
      (value) =>
        value !== null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const indexOfLastUser = currentPage * paymentPerPage;
  const indexOfFirstUser = indexOfLastUser - paymentPerPage;
  const currentPayment = filteredPayment?.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  return (
    <div className="flex flex-col text-center  items-center w-full lg:pt-10">
      <h1 className="text-center text-[30px] font-primary-font">
        Tous les paiements
      </h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-80 text-black rounded p-2 m-5"
      />

      <div className="mx-10 overflow-x-auto">
        <div className="flex flex-col  ">
          <div className="px-4 py-2 flex justify-between gap-3 pointer  bg-[#5b4f67]">
            <p className="w-36 text-center ">Numéro de facture</p>
            <p className="md:w-32 text-center hidden md:block">nom</p>
            <p className="md:w-32 text-center hidden md:block">prenom</p>
            <p className="w-32 text-center">email</p>
            <p className="md:w-32 text-center hidden md:block">montant</p>
          </div>
          {payment &&
            currentPayment.map((pay, index) => (
              <button
                key={pay.bill_number}
                onClick={() => openModal(pay)}
                className={`px-4 py-2 flex justify-between gap-3 pointer ${index % 2 === 0 ? "bg-background-color-second" : "bg-[#5b4f67]"}`}
              >
                <p className="w-36 text-center">{pay.bill_number}</p>
                <p className="md:w-32 text-center hidden md:block">
                  {pay.lastname}
                </p>
                <p className="md:w-32 text-center hidden md:block">
                  {pay.firstname}
                </p>
                <p className="w-32 text-center">{pay.email}</p>
                <p className="md:w-32 text-center hidden md:block">
                  {pay.amount} €
                </p>
              </button>
            ))}
        </div>
      </div>
      <div>
        <PaymentInfoModal
          isOpen={isModalOpen}
          // eslint-disable-next-line react/jsx-no-bind
          onRequestClose={closeModal}
          payment={selectedPayment}
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
          disabled={currentPayment?.length < paymentPerPage}
          className="py-2 px-8 bg-background-color-second text-white rounded pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
