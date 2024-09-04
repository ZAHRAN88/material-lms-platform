import { getUserFromToken } from "@/app/actions";
import Topbar from "@/components/layout/Topbar"
import { Admins } from "@/lib/actions";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromToken();
  const admins = await Admins();
  const isAdmin = user?.role === "ADMIN";


  return (
    <>
    <Topbar isAdmin={isAdmin} />
    {
      !isAdmin ? (
        <>
        {!isAdmin && (
          <div className="flex-1 justify-center items-center h-screen">
            <div className="p-6 flex items-center justify-center flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Access Denied
              </h2>
              <h4 className="text-lg font-semibold text-gray-600">
                You are not <span className="text-red-600 font-bold">AUTHORIZED</span> to access this page
              </h4>
            </div>
          </div>
        )}
        </>
      ):(
        <>
          {children}
        </>
      )
    }
    </>
  )
}

export default HomeLayout
  