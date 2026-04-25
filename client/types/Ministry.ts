export type TrendDirection = "up" | "down" | "flat";
export type TransactionStatus = "Completed" | "Processing" | "Pending" | "Cancelled";

export interface KpiCard {
  id: string;
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  valueSuffix?: string;
  trend: TrendDirection;
  trendLabel: string;
  footer: React.ReactNode | string;
}

export interface AdminNavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  section?: string; // for section headers above the item
}

export interface Transaction {
  id: string;
  txId: string;
  entityInitials: string;
  entityBg: string;
  entityTextColor: string;
  entityName: string;
  entityLocation: string;
  commodity: string;
  volume: string;
  status: TransactionStatus;
  date: string;
}

export interface PriceUpdate {
  id: string;
  label: string;
  timeAgo: string;
}

export type MapView = "Volume" | "Yield";
export type TrendPeriod = "Last 30 Days" | "Last Quarter";


export const adminNavItems: AdminNavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/Ministry/dashboard", active: true },
  { icon: "map", label: "Regional Data", href: "/Ministry/dashboard/RegionalData" },
  { icon: "trending_up", label: "Official Prices", href: "/Ministry/dashboard/PricesManagement" },
  {icon: "category", label: "Categories", href: "/Ministry/dashboard/categories" },
  { icon: "people_alt", label: "Users Management", href: "/Ministry/dashboard/users" },
  { icon: "grains", label: "Ministry Products", href: "/Ministry/dashboard/ministryProducts" },
  {icon: "bar_chart", label: "Analytics", href: "/Ministry/dashboard/analytics" },
];

export const recentTransactions: Transaction[] = [
  {
    id: "1",
    txId: "#TRX-8902",
    entityInitials: "AK",
    entityBg: "bg-blue-100 dark:bg-blue-900/30",
    entityTextColor: "text-blue-600",
    entityName: "Adom Farms Ltd.",
    entityLocation: "Kumasi, Ashanti",
    commodity: "White Maize",
    volume: "45 Tons",
    status: "Completed",
    date: "Oct 24, 2023",
  },
  {
    id: "2",
    txId: "#TRX-8901",
    entityInitials: "NG",
    entityBg: "bg-purple-100 dark:bg-purple-900/30",
    entityTextColor: "text-purple-600",
    entityName: "Northern Grains Co-op",
    entityLocation: "Tamale, Northern",
    commodity: "Sorghum",
    volume: "120 Tons",
    status: "Processing",
    date: "Oct 24, 2023",
  },
  {
    id: "3",
    txId: "#TRX-8900",
    entityInitials: "EK",
    entityBg: "bg-orange-100 dark:bg-orange-900/30",
    entityTextColor: "text-orange-600",
    entityName: "E. Kwesi & Sons",
    entityLocation: "Cape Coast, Central",
    commodity: "Cassava",
    volume: "22 Tons",
    status: "Completed",
    date: "Oct 23, 2023",
  },
];

export const priceUpdates: PriceUpdate[] = [
  { id: "1", label: "Rice MSP increased", timeAgo: "2h ago" },
  { id: "2", label: "Wheat ceiling set", timeAgo: "Yesterday" },
];

export const COMMODITIES = [
  "Maize (White)",
  "Rice (Long Grain)",
  "Sorghum",
  "Yam",
];

export const farmerAvatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPM5HEmkool-j5kEPSqsFvxICn_FUZQ1_TRq4EvFuMdE_peZgbZi8TBZwzMticMcOcGnPH4mdhflmeLCUEd8zjcEMGFYKtdnSI5vxbHNAtOW0vcNTmc6VQZCy4POyanfKoqfSVtRYBInIM-Hv9nNiYEqxh4dtzrcCFWt6hpfo4NJlzrSVMjxhsKL_2X07mJ57gee63Bf5dwfCeeBGpHk68seLI4B-a0zVauLHiYEFR32jeeohrl8TZnqZUewDcthCpjb5lg0hpEHf_",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB94Mae3NKjz1Y2fy0DOfQd07CIt_vegGH6pnklr0Wl4edc3ggM9BSRPCJdBBqEsyW54d8Sl4kiB3uX-P5uuV7lcb1IFS7SsosxHy51CHuvGLbuXyRHNDj7xa043fY1j7RA0m8uAn_tqdYZbyxfNPjMZ2FyOEcvuG8c15MuAZ5zAM_fBjFWl5RvSUsc3nKrEUR3P3ZWbEAPdPCQyh7p6tHMSEZXKaDWjT2EyN42rihGp5_VWGukf35L_0j7N5rUrQAkMD4ZhaxTSzN0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDuPVwe8xpJ9nakwR3oTzTCzfELwZU-NrzV6p5llvwuKiSgqUIorVsSyMJYekX59d455pwPbnc6kmEgCXuq9n7us-hVce4ORBL0m9HsQkuY2X_pnLQvgFhwcs7VIC7nYF7D5fwIcc6DEt8aB7F3aJVkmIOrBhVdl3JMiCCfd6ONHQX6XMiKF8mPZkyKtVTW2EakNw4GHMpVx2YYUixSuyYPe4J9fkj92qzL8kxpjvekD3r53jMTxEb6IYTj1ASdPkhxlv9vEYnbQ9H8",
];