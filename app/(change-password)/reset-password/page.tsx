import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ResetPasswordForm from "@/components/auth/page";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token;

  if (!token) return notFound();

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  const isInvalid = !record;
  const isExpired = record && record.expiresAt < new Date();

  if (isInvalid || isExpired) {
    const title = isInvalid ? "Invalid Link" : "Link Expired";
    const description = isInvalid
      ? "This password reset link is invalid or already used."
      : "This reset link has expired. Please request a new one.";

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg">
          <Alert variant="destructive" className="w-full space-y-4">
            <div>
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription className="w-full break-words">
                {description}
              </AlertDescription>
            </div>

            <Link href="/forgot-password" className="w-full block">
              <Button className="w-full">Request new link</Button>
            </Link>
          </Alert>
        </div>
      </div>
    );
  }

  // ✅ Valid token
  return (
    <ResetPasswordForm
      token={token}
      email={record.email}
    />
  );
}