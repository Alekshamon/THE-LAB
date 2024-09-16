import PropTypes from "prop-types";
import { useState } from "react";
import { TiTick } from "react-icons/ti";

export default function Formules({ formulas, setSelectedFormula }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const handleSelectFormula = (formula) => {
    setSelectedFormula(formula);
    setSelectedCard(formula.id);
  };

  return (
    <div className="flex flex-row justify-center gap-8 my-8 ">
      {formulas.map((formula, i) => (
        <div
          key={formula.id}
          className={`border-2 relative rounded-xl max-w-[400px] 
          ${selectedCard === formula.id ? "ring-4 ring-yellow-400" : ""}
          ${
            i % 2 === 0 ? "bg-gradient-to-bl" : "bg-gradient-to-br"
          } from-fuchsia-600 via-blue-700 to-gray-800`}
          style={{ minHeight: "500px" }}
        >
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mt-16">
            <p className="text-sm text-gradient-color1">{formula.price}€</p>
          </div>
          <h1 className="text-white text-2xl font-bold font-primary-font text-center m-4">
            {formula.title}
          </h1>
          {formula.description.map((des) => (
            <div className="flex flex-row gap-2 items-center p-2 " key={des}>
              <TiTick
                style={{
                  color: "#ffffff",
                }}
                size={24}
              />
              <p className="text-white text-sm">{des}</p>
            </div>
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-black hover:text-white"
              onClick={() => handleSelectFormula(formula)}
            >
              Sélectionner
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

Formules.propTypes = {
  formulas: PropTypes.arrayOf({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  setSelectedFormula: PropTypes.func.isRequired,
};
