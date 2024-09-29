"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import necessary components

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://apmapis.webdevava.live/api";

const CreateUser = ({ onUserCreated }) => {
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Visitor",
    department: "",
    company: "",
    phoneNumber: "",
    designation: "",
    employeeId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to create user");
      toast.success("User created successfully!");
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "Visitor",
        department: "",
        company: "",
        phoneNumber: "",
        designation: "",
        employeeId: "",
      });
      onUserCreated();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return newUser.name && newUser.password && newUser.email && newUser.role;
  };

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createUser} className="space-y-4">
          {/* Essential Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
            <Select
              name="role"
              value={newUser.role}
              onValueChange={(value) =>
                setNewUser((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visitor">Visitor</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="my-4" /> {/* Line separator */}
          {/* Other Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="employeeId"
              placeholder="Employee ID"
              value={newUser.employeeId}
              onChange={handleInputChange}
              required
            />
            <Select
              name="department"
              value={newUser.department}
              onValueChange={(value) =>
                setNewUser((prev) => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Field Executive">Field Executive</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="company"
              placeholder="Company"
              value={newUser.company}
              onChange={handleInputChange}
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
            />
            <Input
              name="designation"
              placeholder="Designation"
              value={newUser.designation}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" disabled={loading || !isFormValid()}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateUser;
