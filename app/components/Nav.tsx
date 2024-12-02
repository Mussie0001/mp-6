"use client";

import React, { useState, useEffect } from "react";

export default function NavBar() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/auth/user");
      const data = await response.json();
      setIsSignedIn(!!data.user);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsSignedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">OAuth App</h1>
      <ul className="flex space-x-4">
        {!isSignedIn ? (
          <li>
            <a
              href="/api/auth/login"
              className="hover:underline"
            >
              Sign In
            </a>
          </li>
        ) : (
          <>
            <li>
              <a
                href="/user"
                className="hover:underline"
              >
                View Profile
              </a>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="hover:underline"
              >
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}