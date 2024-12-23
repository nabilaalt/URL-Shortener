/* eslint-disable react-hooks/exhaustive-deps */
import Login from "@/components/login";
import Signup from "@/components/signup";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {UrlState} from "@/context";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { toast } from "react-hot-toast"; // Import toast
// import ForgotPassword from "@/components/forgot-pass"; 

function Auth() {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {isAuthenticated, loading} = UrlState();
  const longLink = searchParams.get("createNew");
  const isVerified = searchParams.get("verified") === "true"; // Check verified param

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isVerified) {
      toast.success("Verify email berhasil, silahkan login"); // Show toaster if verified
    }
  }, [isVerified]);

  return (
    <div className="mt-10 flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {searchParams.get("createNew")
          ? "Hold up! Let's login first.."
          : "Login / Signup"}
      </h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2"> {/* Mengubah grid-cols menjadi 3 */}
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      
      </Tabs>
    </div>
  );
}

export default Auth;
