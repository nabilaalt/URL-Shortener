import {UAParser} from "ua-parser-js";
import supabase from "./supabase";
const URL_API = import.meta.env.VITE_API_URL;

export async function getClicksForUrls() {
  try {
    const response = await fetch(`${URL_API}/stats/total`);
    const data = await response.json();

    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }
}

export async function getClicksForUrl(url_id) {
  try {
    const response = await fetch(`${URL_API}/stats/${url_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching clicks:", error);
    throw new Error("Unable to load Stats");
  }
}

const parser = new UAParser();

export const storeClicks = async ({id, originalUrl}) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop"; // Default to desktop if type is not detected

    const response = await fetch("https://ipapi.co/json");
    const {city, country_name: country} = await response.json();

    // Record the click
    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
