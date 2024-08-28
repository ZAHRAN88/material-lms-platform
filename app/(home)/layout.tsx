import Topbar from "@/components/layout/Topbar"
import { Admins } from "@/lib/actions";
import { getUserFromToken } from "../actions";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromToken();
  const isAdmin = user?.role === "ADMIN";
    
  return (
    <>
      <Topbar isAdmin={isAdmin} />
      {children}
    </>
  )
}

export default HomeLayout