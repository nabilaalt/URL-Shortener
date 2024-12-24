import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut, ArrowLeft } from "lucide-react"; // ArrowLeft for back button
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("decodedToken"));
  const location = useLocation(); // Get current route location

  // Function to handle back button click
  const handleBack = () => {
    console.log(location.pathname);
    // If on the dashboard or auth page, navigate to landing page
    if (location.pathname === "/dashboard" || location.pathname === "/auth") {
      navigate("/");
    }else if (location.pathname === "/forgot-password") {
        navigate("/");
    } else {
      navigate(-1);
    }
  };

  // Check if we are on specific pages
  const isLandingPage = location.pathname === "/";
  const isAuth = location.pathname === "/auth";
  const isResetPassword = location.pathname === "/forgot-password";
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" className="h-16" alt="Trimrr Logo" />
        </Link>
        <div className="flex gap-4 items-center">
          {/* Conditionally render Back button (if not on landing page) */}
          {!isLandingPage && (
            <Button
              variant="destructive"
              onClick={handleBack}
              className="flex items-center space-x-2 p-2 sm:p-4 border rounded-lg text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          )}
          {/* Conditionally render Login button (if no session and not on auth page) */}
          {!session && !isAuth && !isResetPassword && (
            <Button
              onClick={() => navigate("/auth")}
              variant="destructive"
              className="hover:shadow-xl hover:bg-rose-600 transform transition-all duration-300 ease-in-out"
            >
              Login
            </Button>
          )}
          {/* Dropdown Menu for logged-in users */}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage src={session.profile_pic} />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{session.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      navigate("/");
                    });
                  }}
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;
