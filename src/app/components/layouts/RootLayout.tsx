import { Outlet } from "react-router";
import { Navbar } from "@/app/components/Navbar";
import { Toaster } from "@/app/components/ui/sonner";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
