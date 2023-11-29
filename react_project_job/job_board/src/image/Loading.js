import React, { useEffect, useState } from "react";
import Loading from "./Loading.gif";

export default function Loadings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the token is available in local storage
    const token = localStorage.getItem("user-token");

    // Set isLoggedIn state based on the presence of the token
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="flex items-center justify-center">
      {isLoggedIn ? (
        <img src={Loading} alt="Loading" />
      ) : (
        <div>Sorry, you are not logged in.</div>
      )}
    </div>
  );
}
