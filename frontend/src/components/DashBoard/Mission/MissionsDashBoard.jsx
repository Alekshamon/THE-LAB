import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import AddMissionsModal from "./AddMissionsModal";
import EditMissionsModal from "./EditMissionsModal";
// import AddEventModal from "./AddProductModal";
// import EditProductModal from "./EditProductModal";

export default function MissionsDashBoard() {
  const missionsPerPage = 10;

  const [selectedMissions, setSelectedMissions] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [missions, setMissions] = useState();
  const [currentPage, setCurrentPage] = useState(1);

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
    setSelectedMissions(e);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  const renderStars = (difficulty) => {
    const stars = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 3; i++) {
      stars.push(
        <span key={i} className="text-yellow-500 text-4xl">
          <svg
            className="w-7 h-auto"
            fill={i <= difficulty ? "white" : "grey"}
            stroke="#FFFFFF"
            viewBox="0 0 30 30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2L9 10l-8 1 6 6-2 9 8-5 8 5-2-9 6-6-8-1-3-8z"
            />
          </svg>
        </span>
      );
    }
    return stars;
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/missions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.info(data);
        setMissions(data);
      })
      .catch((err) => console.info(err));
  }, [isAddModalOpen, isEditModalOpen, notification.message]);

  const filteredMissions = missions?.filter((mission) =>
    mission.mission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextPage = () => {
    setCurrentPage((prevPages) => prevPages + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPages) => prevPages - 1);
  };

  const indexOfLastMission = currentPage * missionsPerPage;
  const indexOfFirstMission = indexOfLastMission - missionsPerPage;
  const currentMissions = filteredMissions?.slice(
    indexOfFirstMission,
    indexOfLastMission
  );
  return (
    <div className="flex flex-col justify-center items-center w-full lg:pt-10">
      <h1 className="text-center text-[30px] font-primary-font">
        Toutes les missions
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
          Ajouter une mission
        </button>
        {isAddModalOpen && (
          <AddMissionsModal
            isOpen={isAddModalOpen}
            onRequestClose={closeAddModal}
            notification={notification}
            setNotification={setNotification}
          />
        )}
        {isEditModalOpen && (
          <EditMissionsModal
            isOpen={isEditModalOpen}
            onRequestClose={closeEditModal}
            missionData={selectedMissions}
            notification={notification}
            setNotification={setNotification}
          />
        )}
      </div>
      {/* <div className="flex flex-col flex-wrap text-center  items-center w-auto"> */}
      <div className="flex flex-col text-white font-secondary-font items-center w-full py-5">
        <h1 className="text-2xl pb-4 text-center">Vos missions :</h1>

        <div className="flex flex-row justify-around items-center w-[95%] h-[50px] gap-5 bg-[#5b4f67]">
          <p className="w-[240px] md:w-20 text-center hidden md:block">
            Difficulté
          </p>
          <p className="w-auto md:w-[240px] text-center">Description</p>
          <p className="w-auto md:w-[134px] md:p-2 text-center">Modifié</p>
        </div>
        {currentMissions?.map((miss, index) => (
          <div
            key={miss.id}
            className={`flex flex-row justify-around items-center h-[105px] w-[95%] md:h-[72px] gap-2 ${
              index % 2 === 0 ? "bg-background-color-second" : "bg-[#5b4f67]"
            }`}
          >
            <div className="w-20 md:flex md:flex-row hidden">
              {renderStars(miss.difficulty, miss.id)}
            </div>
            <p className="w-[240px] hidden md:block text-center">
              {miss.mission}
            </p>
            <div className="flex flex-col justify-center items-center w-full  md:hidden">
              <div className=" flex flex-row h-auto">
                {renderStars(miss.difficulty, miss.id)}
              </div>
              <p className="w-48 text-center">{miss.mission}</p>
            </div>
            <HiOutlinePencilAlt
              className=" w-auto md:w-[134px] h-10 cursor-pointer"
              onClick={() => openEditModal(miss)}
            />
          </div>
        ))}
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
          disabled={currentMissions?.length < missionsPerPage}
          className="py-2 px-8 bg-background-color-second text-white rounded pointer"
        >
          Next
        </button>
      </div>
      {/* </div> */}
    </div>
  );
}
