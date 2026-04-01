import type { Metadata } from "next";
import RegistrationPage from "@/components/Auth/Register/RegisterPageClient";

export const metadata: Metadata = {
  title: "Register — AgriConnect",
  description: "Create your account on Algeria's official national agricultural platform.",
};

export default function RegisterPage() {
  return <RegistrationPage />;
}