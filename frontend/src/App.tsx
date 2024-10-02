"use client";

import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CopyIcon, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";

const Starry = lazy(() =>
  import("@/components/starry").then((module) => ({
    default: module.default,
  }))
);
const URLShortenerForm = lazy(() =>
  import("./components/form").then((module) => ({
    default: module.URLShortenerForm,
  }))
);
const QRCodeCanvas = lazy(() =>
  import("qrcode.react").then((module) => ({
    default: module.QRCodeCanvas,
  }))
);

export default function App() {
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-[100svh] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <Toaster position="top-center" />
        <Starry
          minSize={0.5}
          maxSize={2}
          opacity={0.25}
          particleDensity={40}
          className="fixed h-full w-full"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-secondary/30 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-secondary relative z-10"
        >
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-muted-foreground">
            Link Shortener
          </h1>
          <URLShortenerForm
            setErrorMessage={setError}
            setShortUrl={setShortUrl}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-2 bg-red-500/20 border border-red-500 rounded text-red-200 flex items-center"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {shortUrl && (
              <motion.div
                key="shortUrl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-gray-700/50 rounded border border-gray-600"
              >
                <p className="text-sm mb-2 text-gray-300">
                  Your shortened URL:
                </p>
                <div className="flex items-center justify-between bg-gray-600/50 p-2 rounded">
                  <a
                    href={shortUrl}
                    target="_blank"
                    className="text-blue-300 truncate mr-2"
                  >
                    {shortUrl}
                  </a>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="ghost"
                    className="text-gray-300 hover:text-white focus:ring-2 focus:ring-primary shrink-0 transition-colors duration-200"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-4 flex justify-center">
                  <Suspense fallback={<div>Loading QR Code...</div>}>
                    <QRCodeCanvas
                      value={shortUrl}
                      size={200}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"L"}
                      className="rounded"
                      marginSize={2}
                    />
                  </Suspense>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-gray-400 text-sm"
        >
          © {new Date().getFullYear()} Jerry Febriano
        </motion.div>
      </div>
    </ThemeProvider>
  );
}
