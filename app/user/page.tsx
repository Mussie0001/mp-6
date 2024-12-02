"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/User";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/auth/user");
      const data = await response.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-white rounded shadow-2xl">
      <h1 className="text-xl font-bold">Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <img src={user.picture} alt="Profile Picture" className="w-24 h-24 rounded-full" />
    </div>
  );
}