import { getPerformance } from "@/app/actions/getPerformance"
import Chart from "@/components/performance/Chart"
import DataCard from "@/components/performance/DataCard"
import { getUserFromToken } from "@/lib/auth"
import { redirect } from "next/navigation"

const PerformancePage = async () => {
  const user = await getUserFromToken()

  if (!user) {
    return redirect("/sign-in")
  }

  const { data, totalRevenue, totalSales } = await getPerformance(user.id)

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Hello Dr.
      </h2>
      <h4 className="text-lg text-gray-600">
        this section is under development right now
      </h4>
    </div>
  )
}

export default PerformancePage