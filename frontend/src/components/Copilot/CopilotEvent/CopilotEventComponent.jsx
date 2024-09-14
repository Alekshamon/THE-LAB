import React, { useState, useEffect } from "react";
import { LuMapPin } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import { CiMapPin } from "react-icons/ci";
import Button from "../../Button/Button";

const buttonStyles = {
  futures:
    "bg-background-color-second leading-none flex justify-center py-2 px-8 lg:w-[230px] lg:h-12 md:w-[200px] md:h-10 text-[15px] md:text-[18px] lg:text-[24px] font-bold text-white  flex items-center rounded-[20px] hover:bg-gray-400 ease-in",
  passes:
    "bg-background-color-second leading-none flex justify-center py-2 px-8 lg:w-[230px] lg:h-12 md:w-[200px] md:h-10 text-[15px] md:text-[18px] lg:text-[24px] font-bold text-white  flex items-center rounded-[20px] hover:bg-gray-400 ease-in",
};
export default function CopilotEventComponent() {
  const [formData, setFormData] = useState([]);
  const [selectTab, setSelectTab] = useState("active");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stockEvent/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filtered = data
          .filter((event) => event.status === selectTab)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        console.info("aoziz", filtered);
        setFormData(filtered);
      })
      .catch((err) => console.info(err));
  }, [selectTab]);
  return (
    <div className="flex flex-col items-center w-full py-5 text-white  font-secondary-font bg-[#281f31] lg:h-auto rounded-[20px]">
      <h1 className=" text-2xl">Vos événements inscrits :</h1>
      <p className="text-center py-3">
        Ici, vous pouvez consulter les événements auxquels vous êtes inscrit(e).
        Retrouvez les événements à venir en cliquant sur le bouton "Futures", ou
        ceux qui ont déjà eu lieu en sélectionnant "Passés".
      </p>
      <div className=" flex pt-2 items-center justify-center gap-6 mb-4 text-center ">
        <Button
          type="button"
          content="Futures"
          handleClick={() => setSelectTab("active")}
          className={buttonStyles.futures}
        />
        <Button
          type="button"
          content="Passés"
          handleClick={() => setSelectTab("inactive")}
          className={buttonStyles.passes}
        />
      </div>
      {formData?.map((event, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="md:grid justify-center md:items-center text-center md:text-start border border-white font-[100] bg-[#4D3E5C] cursor-pointer ease-in duration-100 p-5 rounded-[20px] m-1  md:w-[500px] w-[270px] "
        >
          <p>
            <LuMapPin className="inline-block " /> Ville : {event.city}
          </p>
          <p>
            <MdOutlineDateRange className="inline-block" /> Date :{" "}
            <span className="font-primary-font  font-bold bg-clip-text text-transparent  bg-gradient-to-b from-gradient-color1 via-gradient-color3 to-gradient-color2">
              {new Date(event.date).toLocaleDateString("fr-FR")}
            </span>
          </p>
          <p>
            <CiMapPin className="inline-block " /> Adresse : {event.address}
          </p>
        </div>
      ))}
    </div>
  );
}
