/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as jose from 'jose'
import { useNavigate } from 'react-router-dom';
import BarLoader from 'react-spinners/BarLoader';

// eslint-disable-next-line react/prop-types
function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const session = localStorage.getItem("decodedToken");
      console.log(session);

      if (session) {
        try {

          const isTokenExpired = session.exp * 1000 < Date.now();
          if (!isTokenExpired) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("jwtToken");
            navigate("/auth");
          }
        } catch (error) {
          console.error("Failed to verify token", error);
          localStorage.removeItem("jwtToken");
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }

      setLoading(false);
    };

    verifyToken();
  }, [navigate]);

  if (loading) {
    return <BarLoader />;
  }

  return isAuthenticated ? children : null;
}

export default RequireAuth;