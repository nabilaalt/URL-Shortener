import supabase from "./supabase";
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData), 
  });

  if (!response.ok) {
   
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }
  const data = await response.json();

  if (data.token) {
    const jwtSecret = new TextEncoder().encode(
      "b41897f961525dd71bdf8bdf7fd1a9ab627e5eebd26ba3cd5d75c04b1921bc9d"
    ); 
    const { payload: decoded } = await jose.jwtVerify(data.token, jwtSecret);

   
    localStorage.setItem("decodedToken", JSON.stringify(decoded));

    console.log("Login successful, token stored and decoded token cached");
  }

  return data; 
}

export async function signup({ name, email, password, profile_pic }) {
 
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  
  const { error: storageError } = await supabase.storage
    .from("shortener-API")
    .upload(`profile_pic/${fileName}`, profile_pic);

  if (storageError) throw new Error(storageError.message);

 
  const { data: publicData, error: urlError } = supabase.storage
    .from("shortener-API")
    .getPublicUrl(`profile_pic/${fileName}`);

  if (urlError) throw new Error(urlError.message);

  const publicURL = publicData.publicUrl; 
  console.log(publicURL);

  
  const requestData = {
    name,
    email,
    password,
    profile_pic: publicURL,
  };

  
  const response = await fetch(`${URL_API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(requestData), 
  });

 
  if (!response.ok) {
   
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

 
  const data = await response.json();
  console.log(data);
  return data; 
}


export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;


  if (error) throw new Error(error.message);
  return session.session?.user;
}

export async function logout() {
  return new Promise((resolve) => {
    localStorage.removeItem("decodedToken");

    setTimeout(() => {
      resolve({ success: true }); 
    }, 1000);
  });
}


