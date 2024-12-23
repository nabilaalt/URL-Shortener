import {useEffect, useState, useCallback} from "react";
import {toast} from "react-hot-toast";
import Error from "./error";
import {Input} from "./ui/input";

import * as Yup from "yup";
import { signup } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { BeatLoader } from "react-spinners";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {Button} from "./ui/button";
import {useNavigate} from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  // State Management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });
  const [errors, setErrors] = useState({});

  // Custom hook for API call
  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  // Input Change Handler
  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  }, []); 

  useEffect(() => {
    if (error === null && data) {
      toast.success("Verification email sent! Please verify before logging in.", {
        duration: 3000, // To make the toast visible for 5 seconds
      });
      navigate('/auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  // Submit Handler
  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required").optional(),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnSignup();
    } catch (validationError) {
      const validationErrors = {};
      if (validationError?.inner) {
        validationError.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      } else {
        validationErrors.api = validationError.message;
      }
      setErrors(validationErrors);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
        {error && <Error message={error?.message} />}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Name Input */}
        <div className="space-y-2">
          <Input
            name="name"
            type="text"
            placeholder="Enter Your Name"
            onChange={handleInputChange}
            value={formData.name}
          />
          {errors.name && <Error message={errors.name} />}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            onChange={handleInputChange}
            value={formData.email}
          />
          {errors.email && <Error message={errors.email} />}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Input
            name="password"
            type="password"
            placeholder="Enter Your Password"
            onChange={handleInputChange}
            value={formData.password}
          />
          {errors.password && <Error message={errors.password} />}
        </div>

        {/* Profile Picture Input */}
        <div className="space-y-2">
          <CardDescription>Set your profile picture:</CardDescription>
          <input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignup} disabled={loading}>
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;