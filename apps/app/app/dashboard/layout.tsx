import { redirect } from "next/navigation";
import Link from "next/link";
import { getMembroEmailServer } from "@/lib/membro-server";
import { ProfileMenu } from "@/components/ProfileMenu";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const email = await getMembroEmailServer();

  if (!email) {
    redirect("/");
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-extrabold text-primary">
            Cápsula <span className="text-secondary">do Tempo</span>
          </Link>
          <ProfileMenu email={email} />
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
