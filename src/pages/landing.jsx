import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (

    <div className="flex flex-col items-center sm:p-5 p-3">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The Fastest Way <br /> to Shorten Your URLs! ⏱️
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
        <Button
          type="submit"
          variant="destructive"
          className="h-full px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:bg-rose-600 hover:scale-105"
        >
          SHORTEN
        </Button>

      </form>

      <div className="w-full md:px-11  mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Easy URL Shortening",
              description: "With just a few clicks, you can convert lengthy, complicated links into short, easy-to-share URLs.",
              icon: "🔗",
              link: "/dashboard",
            },
            {
              title: "URL Management",
              description:
                "Create an account to manage your URLs, track their performance, and organize them easily.",
              icon: "📂",
              link: "/dashboard",
            },
            {
              title: "Advanced Analytics",
              description:
                "Track clicks, user location, and device types for each of your shortened URLs to gather valuable insights.",
              icon: "📊",
              link: "/link/:id",
            },
          ].map((feature, index) => (
            <Link
            to={feature.link}
            key={index}
            className="w-full transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <div
              className="feature-box p-6 border rounded-lg shadow-md text-center bg-white text-gray-900 hover:bg-rose-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              <div className="text-5xl mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          </Link>
          ))}
        </div>

      </div>

    </div>
  );
};

export default LandingPage;
