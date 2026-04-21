import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/business_dashboard/settings-form";
import { redirect } from "next/navigation";

export const metadata = { title: "Settings - Business Center" };

export default async function BusinessSettingsPage() {
  const session = await auth();
  if (!session?.user?.companyId) return redirect("/business/login");

  // 1. Fetch Company Data
  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    include: {
        showcaseItems: true 
    }
  });

  if (!company) return <div>Company not found</div>;

  // 2. Fetch ALL Categories with their Subcategories
  const categories = await prisma.category.findMany({
    include: {
      subCategories: {
        select: { id: true, name: true }, 
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen p-6 lg:p-8 pb-20">
       <div className="max-w-[1440px] mx-auto">
          {/* Passed everything into SettingsForm so the header and save button can live together inside the form */}
          <SettingsForm 
             company={company} 
             categories={categories} 
          />
       </div>
    </div>
  );
}