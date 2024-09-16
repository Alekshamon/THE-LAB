import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import AddEventModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

export default function ProductDashBoard() {
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState();
  const [notification, setNotification] = useState({
    message: "",
    success: false,
  });

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (e) => {
    setSelectedProduit(e);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.info(data);
        setProduct(data);
      })
      .catch((err) => console.info(err));
  }, [isAddModalOpen, isEditModalOpen, notification.message]);

  return (
    <div className="flex flex-col justify-center items-center w-full lg:pt-10">
      <h1 className="text-center text-[30px] font-primary-font">
        Tous les produits
      </h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-80 text-black rounded-lg p-2 m-5"
      />
      <div className="flex space-x-4">
        <button
          onClick={openAddModal}
          className="bg-[#544b5d] rounded-lg hover:bg-gray-300 p-2"
        >
          Ajouter un produit
        </button>
        {isAddModalOpen && (
          <AddEventModal
            isOpen={isAddModalOpen}
            onRequestClose={closeAddModal}
            notification={notification}
            setNotification={setNotification}
          />
        )}
        {isEditModalOpen && (
          <EditProductModal
            isOpen={isEditModalOpen}
            onRequestClose={closeEditModal}
            eventData={selectedProduit}
            notification={notification}
            setNotification={setNotification}
          />
        )}
      </div>
      {/* <div className="flex flex-col flex-wrap text-center  items-center w-auto"> */}
      <div className="text-white grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center font-secondary-font m-5">
        {product
          ?.filter((products) =>
            products.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((prod) => (
            <div
              key={prod.id}
              className="relative flex flex-col flex-wrap justify-start gap-5 items-center  border border-white bg-[#4D3E5C] cursor-pointer p-5 rounded-[20px] m-5 w-[200px] h-[200px]"
            >
              <HiOutlinePencilAlt
                className="absolute top-1 right-1 w-8 h-8"
                onClick={() => openEditModal(prod)}
              />

              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${prod.img}`}
                alt="photos"
                className="w-20 h-20 text-center"
              />
              <p>
                {prod.name} de couleur {prod.color}
              </p>
            </div>
          ))}
      </div>
      {/* </div> */}
    </div>
  );
}
