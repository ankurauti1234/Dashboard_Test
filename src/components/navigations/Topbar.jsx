import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const Topbar = () => {
  const [country, setCountry] = useState("IND");
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = Cookies.get("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleLogout = () => {
    // Remove all cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="p-3 bg-white border-b flex items-center justify-between">
      <Image src="/assets/images/logo.png" alt="logo" width={150} height={18} />

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <DropdownMenu className="bg-white">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[80px] bg-white">
              {country} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={() => setCountry("IND")}>
              IND
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCountry("USA")}>
              USA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {name ? name[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span>{name || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/support")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Topbar;
