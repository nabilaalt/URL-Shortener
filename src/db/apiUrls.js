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
  console.log(data)
  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error || "Error fetching URL");
  }

  return data;
}

export async function createUrl({title, longUrl, customUrl, userId}, qrcode) {
  const shortUrl = Math.random().toString(36).substring(2, 8);
  const fileName = `qr-${shortUrl}`;
  console.log(qrcode);

  const { error: storageError } = await supabase.storage
    .from("shortener-API")
    .upload(`qrs/${fileName}`, qrcode);

  if (storageError) throw new Error(storageError.message);

  const { data: publicData, error: urlError } = supabase.storage
    .from("shortener-API")
    .getPublicUrl(`qrs/${fileName}`);

  const publicURL = publicData.publicUrl; 
  console.log(`Public URL: ${publicURL}`);

  if (urlError) throw new Error(urlError);
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
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(requestData)
  });

  
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.message || 'Failed to create the URL'); 
  }
  
  const data = await response.json();
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

export async function updateUrl({ longUrl, shortUrl, linkId}, qrcode) {
  console.log("shortUrl",shortUrl)
  // Delete existing QR code
  const fileName = `qr-${shortUrl}`;
  const { error: deleteError } = await supabase.storage
    .from("shortener-API")
    .remove([`qrs/${fileName}`]);

  if (deleteError) {
    console.error("Error deleting old QR code:", deleteError);
    throw new Error(deleteError.message);
  }

  // Upload new QR code
  const { error: storageError } = await supabase.storage
    .from("shortener-API")
    .upload(`qrs/${fileName}`, qrcode);

  if (storageError) throw new Error(storageError.message);

  // Get public URL for the new QR code
  const { data: publicData, error: urlError } = supabase.storage
    .from("shortener-API")
    .getPublicUrl(`qrs/${fileName}`);

  if (urlError) throw new Error(urlError.message);

  const publicURL = publicData.publicUrl;
  console.log(`Updated Public URL: ${publicURL}`);

  // Prepare update data
  const updateData = {
    originalUrl: longUrl,
  };

  console.log(updateData)

  // Send PUT request to update the URL
  const response = await fetch(`${URL_API}/shortener/${linkId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData)
  });

  const data = await response.json();
  console.log("updated Data", data)

  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error || "Error updating URL");
  }

  return data.link;
}
