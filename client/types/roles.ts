export type UserRole = "FARMER" | "BUYER" | "TRANSPORTER" | "ADMIN";

export const ROLE_LINKS: Record<UserRole, { label: string; href: string }[]> = {
  FARMER: [
    {label: "Marketplace", href: "/marketplace" },
    {label: "Home", href: "/" },
    { label: "Messages", href: "/chat" }, 
    { label: "Dashboard", href: "/farmer/dashboard/products" },
    { label: "Profile", href: "/farmer/profile" },
  ],
  BUYER: [
    { label: "Marketplace", href: "/marketplace" },
    {label: "Home", href: "/" },
    { label: "Messages", href: "/chat" }, 
    { label: "Profile", href: "/buyer/profile" },
    { label: "Cart", href: "/Cart" },
    { label: "Checkout", href: "/Checkout" },
    { label: "Dashboard", href: "/buyer/dashboard" },
  ],
  TRANSPORTER: [
    { label: "Dashboard", href: "/Transporter/dashboard/missions" },
    {label: "Home", href: "/" },
    { label: "Profile", href: "/Transporter/profile" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/Ministry/dashboard" },
    {label: "Home", href: "/" },
  ],
};