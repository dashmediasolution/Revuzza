import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShowcaseManager } from "@/components/business_dashboard/showcase-manager";

export const metadata = { title: "Manage Products & Services" };

export default async function ShowcasePage() {
  const session = await auth();
  if (!session?.user?.companyId) return redirect("/business/login");

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    include: {
        showcaseItems: true 
    }
  });

  if (!company) return <div>Company not found</div>;

  return (
    <div className="min-h-screen p-6 lg:p-8 pb-20">
       <div className="max-w-[1440px] mx-auto">
          <ShowcaseManager company={company} />
       </div>
    </div>
  );
}