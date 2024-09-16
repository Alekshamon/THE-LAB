import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoNavbar from "../../assets/logo_navbar.svg";
import { UserContext } from "../../context/UserContext";
import BurgerIcon from "../BurgerIcon/BurgerIcon";
import ModalLogout from "../ModalLogout/ModalLogout";
import NavBarYoussef from "../Navbar/NavBarYoussef";

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const { user, setUser, updateToken } = useContext(UserContext);

  const [navig, setNavig] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    setUser({});
    updateToken();
    setShow(false);
    setNavig("");
    navigate("/");
  };
  const buttonLogin =
    "bg-gradient-to-r leading-none py-1 px-2 text-[20px]  lg:py-4  lg:px-6 md:py-2  md:px-4 from-[#4CACFF] via-[#A070EF] to-[#8E78DA] text-white  flex items-center rounded-[20px] hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF]  ease-in";

  const buttonSignUp =
    "bg-gradient-to-r leading-none py-1 px-2 text-[20px] lg:py-4  lg:px-6  md:py-2  md:px-4 from-[#F5ABF1] via-[#B980F8] to-[#7651FF] text-white  flex items-center rounded-[20px] hover:bg-gradient-to-r hover:from-[#F5ABF1] hover:via-[#F5ABF1] hover:to-[#F5ABF1]  ease-in";

  useEffect(() => {
    if (user) {
      if (user.data?.is_admin === "user") {
        setNavig("copilot");
      } else {
        setNavig("backoffice");
      }
    }
  }, [user]);

  return (
    <header className="flex flex-row justify-between items-center bg-background-color-second p-2 font-secondary-font h-[100px] lg:h-auto">
      <BurgerIcon isOpen={isOpen} setOpen={setOpen} />

      {/* <div className="flex items-center text-white "> */}
      <Link to="/" className="flex items-center text-white ">
        <img
          src={logoNavbar}
          alt="logo"
          className="lg:w-20 lg:h-20 lg:flex hidden "
        />

        <h1 className="font-primary-font absolute p-1 left-20 top-[30px] text-4xl  md:initial lg:left-20 lg:top-6">
          THE LAB
        </h1>
      </Link>
      {/* </div> */}
      <NavBarYoussef isOpen={isOpen} />
      {user.isLogged ? (
        <>
          <ModalLogout
            show={show}
            handleClick={handleClick}
            setShow={setShow}
          />
          <div className="flex gap-6  text-white mr-2 lg:mr-10 items-center">
            <button className="bg-transparent border-none" type="button">
              {user.data.avatar !== null ? (
                <Link to={navig}>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <img
                      className="w-16 h-16 lg:w-8 lg:h-8 rounded-full"
                      src={`${import.meta.env.VITE_BACKEND_URL}/${
                        user.data.avatar
                      }`}
                      alt="avatarUser"
                    />
                    {user.data.is_admin === "user" ? (
                      <p className="text-white text-3xl lg:text-base">
                        COPILOT
                      </p>
                    ) : (
                      <p className="text-white text-3xl lg:text-base">
                        BACKOFFICE
                      </p>
                    )}
                  </div>
                </Link>
              ) : (
                <Link to={navig}>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <img
                      className="w-16 h-16 lg:w-8 lg:h-8"
                      src="/user.svg"
                      alt="userAvatar"
                    />
                    {user.data.is_admin === "user" ? (
                      <p className="text-white text-3xl lg:text-base">
                        COPILOT
                      </p>
                    ) : (
                      <p className="text-white text-3xl lg:text-base">
                        BACKOFFICE
                      </p>
                    )}
                  </div>
                </Link>
              )}
            </button>
            <button
              className="bg-transparent border-none"
              type="button"
              onClick={() => setShow(true)}
            >
              <img className="w-16 lg:h-8" src="/logout.svg" alt="logout" />
            </button>
          </div>
        </>
      ) : (
        <div className=" flex items-center gap-2 text-center pr-2">
          <Link to="/signup" className={buttonLogin}>
            Inscription
          </Link>
          <Link to="/login" className={buttonSignUp}>
            Connexion
          </Link>
        </div>
      )}
    </header>
  );
}
