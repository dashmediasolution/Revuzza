import { verifyEmailToken } from '@/lib/actions';
import Link from 'next/link';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const result = params.token ? await verifyEmailToken(params.token) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-sm border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Email Verification</h1>
        <p className="mt-3 text-sm text-gray-600">
          {result?.success
            ? result.message
            : result?.message || 'We could not verify your email yet.'}
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-[#0ABED6] px-4 py-2 text-sm font-medium text-white hover:bg-[#09a8c2]"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
