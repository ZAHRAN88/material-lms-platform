import { getUserFromToken } from "@/app/actions";
import Topbar from "@/components/layout/Topbar"
import { Admins } from "@/lib/actions";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromToken();
  const admins = await Admins();
  const isAdmin = user ? admins.some(admin => admin.id === user.id) : false;

  return (
    <>
      <Topbar isAdmin={isAdmin} />
      {children}
    </>
  )
}

export default HomeLayout