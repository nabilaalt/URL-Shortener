
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

