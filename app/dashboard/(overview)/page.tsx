import { Suspense } from "react"
import CardWrapper from "../../ui/dashboard/cards"
import LatestInvoices from "../../ui/dashboard/latest-invoices"
import RevenueChart from "../../ui/dashboard/revenue-chart"
import { lusitana } from "../../ui/fonts"
import { CardSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/app/ui/skeletons"
import { auth } from "@/auth"
import { UserCircleIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { Button } from "@/app/ui/button"


const DashboardMainPage = async () => {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        console.log("No User information.")
        return null
    }

    const userImage = user.image ?
        <Image className="rounded-full" src={user.image} width={50} height={50} alt="User image" /> :
        <UserCircleIcon />
    return (
        <main>

            <div className="flex flex-row justify-start items-center gap-3 mb-5">
                {userImage}
                <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
                    {user.name as string}
                </h1>
            </div>

            {/* All these components are loading there data in therselves! */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* using suspense in wrapper way! */}
                <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                {/* using suspense to load one comp */}
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    )
}

export default DashboardMainPage