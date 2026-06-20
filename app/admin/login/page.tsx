import { AdminLoginForm } from "@/components/admin_components/admin-login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <AdminLoginForm
          callbackUrl={params.callbackUrl ?? "/admin"}
        />
      </div>
    </div>
  );
}