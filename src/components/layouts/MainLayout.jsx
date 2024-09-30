"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../navigations/Sidebar";
import { useRouter } from "next/navigation";
import Topbar from "../navigations/Topbar";
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "sonner";

export default function MainLayout({ children }) {
  const [tokenExpired, setTokenExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const expiry = Cookies.get("expiry");

      if (!token) {
        // No token found, redirect to login
        router.push("/login");
      } else if (expiry && Date.now() > Number(expiry)) {
        // Token expired
        setTokenExpired(true);
        clearAuthCookies();
      }
    };

    checkAuth();
  }, [router]);

  const clearAuthCookies = () => {
    Cookies.remove("token");
    Cookies.remove("name");
    Cookies.remove("role");
    Cookies.remove("expiry");
    Cookies.remove("email");
  };

  const handleLoginRedirect = () => {
    setTokenExpired(false);
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar />
      <div className="flex overflow-hidden">
        <div className="block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-0">
            <Toaster />
            <AlertDialog open={tokenExpired} onOpenChange={setTokenExpired}>
              <AlertDialogTrigger></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Token Expired</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your session has expired. Please log in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleLoginRedirect}>
                    Login Again
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {children}
          </main>
          <div />
        </div>
      </div>
    </div>
  );
}
