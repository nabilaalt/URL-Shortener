import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Error from "./error";
import { login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import * as jose from "jose";
// import {UrlState} from "@/context";
const URL_API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {loading, error, fn: fnLogin, data} = useFetch(login, formData);
  console.log(loading,error, data);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        // Save token to localStorage
        console.log(token)
        const jwtSecret = new TextEncoder().encode(
          "b41897f961525dd71bdf8bdf7fd1a9ab627e5eebd26ba3cd5d75c04b1921bc9d"
        ); // Replace with your actual secret
        const { payload: decoded } = await jose.jwtVerify(token, jwtSecret);
        console.log(decoded);
        // Store the decoded token in cache (localStorage in this case)
        localStorage.setItem("decodedToken", JSON.stringify(decoded));

        // Redirect to the dashboard or specific page
        navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      }

      if (error === null && data) {
        navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      }
    };

    verifyToken();
  }, [error, data, token, longLink, navigate]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Access your account if you already have one
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        {errors.email && <Error message={errors.email} />}
        <div className="space-y-2">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        {errors.password && <Error message={errors.password} />}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-">

  <Button 
    onClick={handleLogin}
    disabled={loading}
    variant="destructive"
    className="w-full">
    {loading ? <BeatLoader size={10} /> : "Login"}
  </Button>

  <Button 
    onClick={() => {window.location.href = `${URL_API}/auth/google`;}} 
    disabled={loading}
    className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-200">
    <img 
      src="public/logo-google.png" 
      alt="Google Logo" 
      className="w-5 h-5 mr-2" />
    {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login With Google"}
  </Button>

</CardFooter>
<div className="flex justify-end w-full pr-6">
    <button 
      onClick={() => navigate('/forgot-password')} 
      disabled={loading}
      className="text-sm text-blue-400 hover:underline pb-6">
      Forgot your password?
    </button>
  </div>
    </Card>
  );
};

export default Login;