import supabase from "./supabase";
const URL_API = import.meta.env.VITE_API_URL;


export async function getUrls(user_id) {
  const response = await fetch(`${URL_API}/user/${user_id}/links`);
  const data = await response.json();


  if (!response.ok) {
    console.error(data.error);
    throw new Error("Unable to load URLs");
  }

  return data.links;
}

export async function getUrl({id}) {
  const response = await fetch(`${URL_API}/shortener/${id}`);
  const data = await response.json();
  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error || "Error fetching URL");
  }

  return data;
}

export async function getLongUrl(id) {
  let {data: shortLinkData, error: shortLinkError} = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

export async function createUrl({title, longUrl, customUrl, userId}, qrcode) {
  const shortUrl = Math.random().toString(36).substring(2, 8);
  const fileName = `qr-${shortUrl}`;
  console.log(qrcode)

  const {error: storageError} = await supabase.storage
    .from("shortener-API")
    .upload(`qrs/${fileName}`, qrcode);

  if (storageError) throw new Error(storageError.message);

  const { data: publicData, error: urlError } = supabase.storage
    .from("shortener-API")
    .getPublicUrl(`qrs/${fileName}`);

  const publicURL = publicData.publicUrl; // Properly access the public URL
  console.log(`Public URL: ${publicURL}`);

  if (urlError) throw new Error(urlError.message);
  const requestData = {
    title,
    userId,
    originalUrl: longUrl,
    customUrl,
    shortUrl,
    qr: publicURL,
  };

  const response = await fetch(`${URL_API}/shortener`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify(requestData)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error || "Error creating short URL");
  }
  return data.link;
}

export async function deleteUrl(id) {
  const response = await fetch(`${URL_API}/shortener/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error || "Error deleting URL");
  }

  return data;
}
