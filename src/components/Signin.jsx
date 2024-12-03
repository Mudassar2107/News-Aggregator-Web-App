import React, { useEffect } from "react";
import front from "../images/login-bg.jpg";
import logo from "../images/news-logo.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = () => {
    loginWithRedirect();
  };

  return (
    <div className="grid grid-cols-2  bg-black h-screen">
      {/* left block */}
      <div className="flex items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="" className="h-14 mx-auto" />
          <h1 className="text-white text-xl font-semibold mt-2">News App</h1>
          <button
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-12 w-96 mt-14"
          >
            Sign in
          </button>
        </div>
      </div>

      {/*right block  */}
      <div>
        <img src={front} alt="login-page-image" />
      </div>
    </div>
  );
}

export default Signin;