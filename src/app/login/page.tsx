import { redirect } from "next/navigation";

import { FormularioLogin } from "@/components/formulario-login";
import { getSesion } from "@/lib/auth";

export default async function LoginPage() {
  const { user } = await getSesion();
  if (user) redirect("/admin");

  return <FormularioLogin />;
}
