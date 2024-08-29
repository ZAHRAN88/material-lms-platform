import { redirect } from "next/navigation";

import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import { Admins } from "@/lib/actions";
import { getUserFromToken } from "../actions";

const InstructorLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromToken();
  console.log(user);
const isAdmin = user?.role === "ADMIN";
  
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar isAdmin={isAdmin} />
      <div className="flex-1 flex">
        <Sidebar />
        {isAdmin && (
          <div className="flex-1 rounded-lg">{children}</div>
        )}
      </div>
      {!isAdmin && (
        <div className="flex-1 justify-start h-4">
          <div className="p-6 flex items-center justify-start flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Hello Student
            </h2>
            <h4 className="text-lg font-bold text-gray-600">
              You Are Not <span className="text-red-600 font-bold">AUTHORIZED</span>
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorLayout;