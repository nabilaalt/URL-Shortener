import supabase, { supabaseUrl } from "./supabase";
import * as jose from "jose";


const URL_API = import.meta.env.VITE_API_URL

export async function login({ email, password }) {
  
  const requestData = {
    email,
    password,
  };

  console.log(URL_API)

  const response = await fetch(`${URL_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify(requestData), // Convert the data to JSON string
  });

  if (!response.ok) {
    // If the response is not ok (status code not 200), throw an error
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  // Parse the response JSON
  const data = await response.json();

  // Check if the token is in the response
  if (data.token) {
    // Store the token in localStorage (or use sessionStorage / cookies if needed)
    const jwtSecret = new TextEncoder().encode(
      "b41897f961525dd71bdf8bdf7fd1a9ab627e5eebd26ba3cd5d75c04b1921bc9d"
    ); // Replace with your actual secret
    const { payload: decoded } = await jose.jwtVerify(data.token, jwtSecret);

    // Store the decoded token in cache (localStorage in this case)
    localStorage.setItem("decodedToken", JSON.stringify(decoded));

    console.log("Login successful, token stored and decoded token cached");
  }

  return data; // Return the data received from the external API
}

export async function signup({ name, email, password, profile_pic }) {
  // Generate a unique file name for the profile picture
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  // Upload the profile picture to Supabase storage
  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic);

  if (storageError) throw new Error(storageError.message);

  // Build the URL for the profile picture stored in Supabase
  const profilePicUrl = `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`;

  // Prepare the data to send to the external API
  const requestData = {
    name,
    email,
    password,
    profile_pic : profilePicUrl
  };

  // Send the data to the external API via POST request
  const response = await fetch(`${URL_API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify(requestData), // Convert the data to JSON string
  });

  // Handle the response from the API
  if (!response.ok) {
    // If the response is not ok (status code not 200), throw an error
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  // Parse the response JSON and return the data
  const data = await response.json();
  console.log(data);
  return data; // Return the data received from the external API
}

export async function resetPassword({ email }) {
  const { error } = await supabase.auth.api.resetPasswordForEmail(email);

  if (error) throw new Error(error.message);

  return { message: 'Password reset email sent successfully.' };
}

export async function sendVerificationEmail({ email }) {
  const { error } = await supabase.auth.api.sendPasswordResetEmail(email);

  if (error) throw new Error(error.message);

  return { message: "Verification email sent." };
}

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;

  // const {data, error} = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return session.session?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
