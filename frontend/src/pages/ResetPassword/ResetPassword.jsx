import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import TopMain from "../../components/TopMain/TopMain";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [params] = useSearchParams();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword")
      if (e.target.value !== formData.password) {
        setErrorMessage("Vous devez saisir le même mot de passe !");
      } else {
        setErrorMessage("");
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/reset-password?token=${params.get("token")}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erreur de requête : ${response.status} ${text}`);
          });
        }
        return response.json();
      })
      .then((res) => {
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setErrorMessage(
          error.message ||
            "Une erreur est survenue lors de la réinitialisation du mot de passe."
        );
      });
  };

  return (
    <>
      <TopMain
        title="Nouveau Mot De Passe"
        description="Veuillez saisir votre nouveau mot de passe"
      />
      <div className=" xl:w-[700px] mt-8 mb-4 ml-8 mr-8 font-secondary-font">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="relative text-white">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="input"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 focus:outline-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Eye /> : <EyeOff />}
            </button>
            <label
              htmlFor="password"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Mot de passe*
            </label>
          </div>
          <div className="relative text-white">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 focus:outline-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <Eye /> : <EyeOff />}
            </button>
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            <label
              htmlFor="password"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Confirmation*
            </label>
          </div>
          <button
            type="submit"
            disabled={formData.password !== formData.confirmPassword}
            className="py-3 px-5 text-md font-bold text-center tracking-widest text-secondary bg-primary sm:w-fit focus:outline-none 
            bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-primary-font md:w-[200px] w-full"
          >
            {loading ? "Patientez..." : "Confirmation"}
          </button>
        </form>
      </div>
    </>
  );
}
