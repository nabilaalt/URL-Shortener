import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>

      <div className="p-10 text-center disabled:opacity-50 bg-rose-500 mt-10">
        <p>&copy; 2024. All rights reserved.</p>
        <div className="mt-4">
          <a href="/privacy-policy" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
          <span className="mx-2">|</span>
          <a href="/terms-of-service" className="text-blue-400 hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
