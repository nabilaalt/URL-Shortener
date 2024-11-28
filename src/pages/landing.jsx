import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (

    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
      The Fastest Way <br/> to Shorten Your URLs! ⏱️ 
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2 "
      >
        <Input
          type="url"
          placeholder="Enter your long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button type="submit" className="h-full bg-[#3A6D8C]">SHORTEN</Button>

      </form>
    
      <div className="w-full md:px-11  mt-12">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="feature-box p-6 border rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:bg-gray-600 hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-2">Easy URL Shortening</h3>
      <p>Quickly shorten long URLs with just a few clicks.</p>
    </div>
    <div className="feature-box p-6 border rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:bg-gray-600 hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-2">URL Management</h3>
      <p>Create an account to manage your URLs, track their performance, and organize them easily.</p>
    </div>
    <div className="feature-box p-6 border rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:bg-gray-600 hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
      <p>Track clicks, user location, and device types for each of your shortened URLs to gather valuable insights.</p>
    </div>
  </div>
</div>

    </div>
  );
};

export default LandingPage;
