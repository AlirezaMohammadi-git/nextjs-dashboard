import { Suspense } from "react"
import CardWrapper from "../../ui/dashboard/cards"
import LatestInvoices from "../../ui/dashboard/latest-invoices"
import RevenueChart from "../../ui/dashboard/revenue-chart"
import { lusitana } from "../../ui/fonts"
import { CardSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/app/ui/skeletons"


const DashboardMainPage = async () => {
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
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