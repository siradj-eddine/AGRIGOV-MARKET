export type UserRole = "FARMER" | "BUYER" | "TRANSPORTER" | "ADMIN";

export const ROLE_LINKS: Record<UserRole, { label: string; href: string }[]> = {
  FARMER: [
    {label: "Marketplace", href: "/marketplace" },
    {label: "Home", href: "/" },
    { label: "Dashboard", href: "/farmer/dashboard/products" },
    { label: "Profile", href: "/farmer/profile" },
    { label: "Cart", href: "/Cart" },
    { label: "Checkout", href: "/Checkout" },
  ],
  BUYER: [
    { label: "Marketplace", href: "/marketplace" },
    {label: "Home", href: "/" },
    { label: "Profile", href: "/buyer/profile" },
    { label: "Cart", href: "/Cart" },
    { label: "Checkout", href: "/Checkout" },
  ],
  TRANSPORTER: [
    { label: "Dashboard", href: "/Transporter/dashboard/missions" },
    { label: "Cart", href: "/Cart" },
    {label: "Home", href: "/" },
    { label: "Profile", href: "/Transporter/profile" },
    { label: "Checkout", href: "/Checkout" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/Ministry/dashboard/users" },
    {label: "Home", href: "/" },
  ],
};