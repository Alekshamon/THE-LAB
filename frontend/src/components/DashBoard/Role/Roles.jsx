/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from "react";
import RolesModals from "./RolesModal";
import king from "../../../assets/icons/king.svg";

export default function MainContentUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 10;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userss`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const updateRole = (userId, role) => {
    const endpoint = role === "admin" ? "admin" : "notadmin";
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify({ id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.info("Success:", data);
        // Met à jour localement le rôle de l'utilisateur après succès
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, is_admin: role } : user
          )
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const nextPage = () => setCurrentPage((prevPages) => prevPages + 1);
  const prevPage = () => setCurrentPage((prevPages) => prevPages - 1);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        value !== null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="flex flex-col text-center items-center w-full lg:pt-10">
      <h1 className="text-center text-[30px] font-primary-font">
        Tous les utilisateurs
      </h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-80 text-black rounded p-2 m-5"
      />
      <div className="w-[90%] overflow-x-auto">
        <div className="flex flex-col">
          <div className="px-4 py-2 flex justify-between gap-3 bg-[#5b4f67]">
            <p className="w-40">Nom</p>
            <p className="w-40">Prénom</p>
            <p className="w-40">Email</p>
            <p className="w-40">User/Admin</p>
          </div>
          {currentUsers.map((user, index) => (
            <div
              key={user.id}
              className={`px-4 py-2 flex justify-between items-center gap-3 ${index % 2 === 0 ? "bg-background-color-second" : "bg-[#5b4f67]"}`}
            >
              <p className="w-40">{user.lastname}</p>
              <p className="w-40">{user.firstname}</p>
              <p className="w-40">{user.email}</p>
              {user.is_admin === "user" || user.is_admin === "admin" ? (
                <div className="w-40 flex flex-col justify-center items-center">
                  <button
                    className={`border-[1px] rounded-full w-[50px] h-[28px] cursor-pointer relative transition-all ease-in-out duration-100 hover:border-[#6f6f6f] ${user.is_admin === "admin" ? "bg-[#15b58e]" : "bg-gray-500"}`}
                    onClick={() => {
                      updateRole(
                        user.id,
                        user.is_admin === "admin" ? "user" : "admin"
                      );
                      openModal(user);
                    }}
                  >
                    <div
                      className={`absolute h-[20px] w-[20px] bg-white rounded-full transition-left ease-in-out duration-150 left-[3px] top-1/2 transform -translate-y-1/2 ${user.is_admin === "admin" ? "left-[calc(50px-25px)]" : ""}`}
                    />
                  </button>
                  {user.is_admin === "admin" ? <p>Admin</p> : <p>User</p>}
                </div>
              ) : (
                <div className="w-40 flex flex-col justify-center items-center">
                  <img src={king} alt="icone_superadmin" className="w-8 h-8" />
                  <p>Super admin</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <RolesModals
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        user={selectedUser}
      />
      <div className="flex justify-between m-4 gap-5">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-background-color-second text-white rounded pointer"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentUsers.length < usersPerPage}
          className="py-2 px-8 bg-background-color-second text-white rounded pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
