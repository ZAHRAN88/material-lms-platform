"use client";

import { TextEffect } from "@/components/TextEffect";
import { useAuth } from "@/lib/AuthContext";

const Header = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div className="text-xl font-bold p-5">
      <TextEffect per="char" preset="fade">
        {user 
          ? `Hello ${user.name}, Your enrolled courses are here`
          : "Welcome, please sign in to see your enrolled courses"}
      </TextEffect>
    </div>
  );
};

export default Header;