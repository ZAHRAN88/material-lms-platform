"use client";

import { TextEffect } from "@/components/TextEffect";
import { useAuth } from "@/lib/AuthContext";

const Header = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="text-xl font-bold p-5">
      <TextEffect per="char" preset="fade">
         
           {`Hello ${user?.name}, Your enrolled courses are here`}
          
      </TextEffect>
    </div>
  );
};

export default Header;