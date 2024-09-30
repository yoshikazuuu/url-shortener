"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, LinkIcon, AlertCircle } from "lucide-react";
import axios from "axios";
import Starry from "./starry";
import Link from "next/link";
import { toast } from "sonner";

export function ModernLinkShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customId, setcustomId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shorten`,
        {
          url,
          customId,
        }
      );
      setShortUrl(response.data.shortURL);
      toast.success("URL shortened successfully");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError(err.response.data.error || "Custom ID already exists");
        toast.error(err.response.data.error || "Custom ID already exists");
      } else {
        console.error(err);
        setError("Failed to shorten URL. Please try again.");
        toast.error("Failed to shorten URL. Please try again.");
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="url"
              placeholder="Enter your long URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="focus-within:ring-2 focus-visible:ring-2 focus-visible:ring-primary focus-within:ring-primary focus-within:border-transparent w-full bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <LinkIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center bg-gray-700/50 border border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
              <span className="pl-3 text-gray-400 h-full flex items-center">
                jer.ee/
              </span>
              <Input
                type="text"
                placeholder="custom-code (optional)"
                value={customId}
                onChange={(e) => setcustomId(e.target.value)}
                className="flex-grow bg-transparent focus-visible:ring-0 focus:outline-none border-none focus:ring-0 text-gray-100 placeholder-gray-400 p-2 outline-none"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Shorten URL
          </Button>
        </form>
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
              <p className="text-sm mb-2 text-gray-300">Your shortened URL:</p>
              <div className="flex items-center justify-between bg-gray-600/50 p-2 rounded">
                <Link
                  href={shortUrl}
                  target="_blank"
                  className="text-blue-300 truncate mr-2"
                >
                  {shortUrl}
                </Link>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="ghost"
                  className="text-gray-300 hover:text-white focus:ring-2 focus:ring-primary shrink-0 transition-colors duration-200"
                >
                  <CopyIcon className="w-4 h-4" />
                </Button>
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
  );
}
