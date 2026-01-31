import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { Toaster } from "@/app/components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </SocketProvider>
    </AuthProvider>
  );
}
