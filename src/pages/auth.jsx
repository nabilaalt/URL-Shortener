/* eslint-disable react-hooks/exhaustive-deps */
import Login from "@/components/login";
import Signup from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast"; // Import toast

function Auth() {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();
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
    <div className="mt-10 flex flex-col items-center gap-10 px-4 sm:px-0">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-center">
        {searchParams.get("createNew")
          ? "Hold up! Let's login first.."
          : "Login / Signup"}
      </h1>

      <Tabs defaultValue="login" className="w-full sm:w-[400px]">
        <TabsList className="grid w-full grid-cols-2 gap-4">

          <TabsTrigger value="login" className="text-sm sm:text-base">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-sm sm:text-base">
            Signup
          </TabsTrigger>
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
