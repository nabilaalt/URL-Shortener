/* eslint-disable react/prop-types */
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const APP_URL = import.meta.env.VITE_APP_URL

const LinkCard = ({ url = {}, fetchUrls }) => {

  const downloadImage = () => {
    const imageUrl = url?.qr; // Adjusted property name
    const fileName = url?.title; // Adjusted property name

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url._id); // Adjusted ID property

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr} // Adjusted property name
        className="h-32 object-contain ring ring-rose-200 self-start"
        alt="QR Code"
      />
      <Link to={`/link/${url?._id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title} {/* Adjusted property name */}
        </span>
        <span className="truncate w-full text-2xl text-rose-400 font-bold hover:underline cursor-pointer">
          {APP_URL}/{url?.customUrl || url?.shortUrl} {/* Adjusted property name */}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          <LinkIcon className="p-1" />
          <span className="truncate w-full text-base md:text-sm">{url?.originalUrl}</span> 
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.createdAt).toLocaleString()} {/* Adjusted property name */}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(
              `${APP_URL}/${url?.shortUrl}` /* Adjusted property name */
            )
          }
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete} // Fixed typo from 'disable' to 'disabled'
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
