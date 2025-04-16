

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "@radix-ui/react-icons";

export function PageNotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <div className="w-full max-w-md text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <div className="text-8xl font-bold text-primary">404</div>
        </motion.div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <RocketIcon className="h-4 w-4" />
          Return Home
        </Button>
      </div>
    </motion.div>
  );
}
export default PageNotFound;