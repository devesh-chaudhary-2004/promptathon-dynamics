import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-9xl font-bold text-transparent">
            404
          </h1>
        </motion.div>

        <h2 className="mb-4 text-3xl font-bold text-white">Page Not Found</h2>
        <p className="mb-8 text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <Search className="mr-2 h-4 w-4" />
              Browse Skills
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
