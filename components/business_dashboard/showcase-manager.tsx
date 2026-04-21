"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { 
  updateCompanyType, addShowcaseItem, updateShowcaseItem, deleteShowcaseItem, uploadShowcaseImage 
} from "@/lib/showcase-actions"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  Package, Briefcase, Lock, Plus, Trash2, ImageIcon, 
  Pencil, AlertTriangle, Loader2, Search, Info, Sparkles 
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Prisma } from "@prisma/client"; 

// Import your existing Showcase Modal
import { ShowcaseModal } from "@/components/company_components/showcase-modal"; 

type CompanyWithShowcase = Prisma.CompanyGetPayload<{
  include: { showcaseItems: true }
}>;

interface ShowcaseManagerProps {
  company: CompanyWithShowcase;
}

// ✅ Added helper to format the createdAt date
function formatDate(date: Date | string) {
   if (!date) return '';
   return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ShowcaseManager({ company }: ShowcaseManagerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [showcasePending, setShowcasePending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [newItemImages, setNewItemImages] = useState<string[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  
  const hasAccess = company.plan === "GROWTH" || company.plan === "SCALE" || company.plan === "CUSTOM";
  const companyType = company.companyType || "SERVICE";
  const isTypeLocked = !!company.companyType; 
  
  // ✅ Extract plan for the badge
  const userPlan = company.plan || "FREE";

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { name: "", description: "", linkUrl: "" }
  });

  // --- SEARCH LOGIC ---
  const currentQuery = searchParams.get("q")?.toString() || "";

  const handleSearch = useDebouncedCallback((term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
          params.set("q", term);
      } else {
          params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Filter items by type and search query
  const filteredItems = company.showcaseItems?.filter(item => {
      const matchesType = item.type === companyType;
      const matchesSearch = item.name.toLowerCase().includes(currentQuery.toLowerCase());
      return matchesType && matchesSearch;
  }) || [];

  const previewItem = filteredItems.length > 0 ? filteredItems[0] : null;

  // --- ACTIONS ---
  const onTypeChange = async (val: string) => {
    toast.promise(updateCompanyType(company.id, val as any), {
        loading: "Setting business type...",
        success: "Type set successfully",
        error: "Failed to update"
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { 
         toast.error("File size too large (Max 5MB)");
         return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadShowcaseImage(formData);

    if (result.success && result.url) {
        setNewItemImages((prev) => [...prev, result.url!]);
        toast.success("Image uploaded");
    } else {
        toast.error("Upload failed");
    }
    
    e.target.value = ""; 
    setIsUploading(false);
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id);
      setValue("name", item.name);
      setValue("description", item.description);
      setValue("linkUrl", item.linkUrl || "");
      setNewItemImages(item.images || []);
      setModalOpen(true);
  };

  const handleCreate = () => {
      setEditingId(null);
      reset();
      setNewItemImages([]);
      setModalOpen(true);
  };

  const onShowcaseSubmit = async (data: any) => {
    setShowcasePending(true);
    let result;
    if (editingId) {
        result = await updateShowcaseItem(editingId, { ...data, images: newItemImages });
    } else {
        result = await addShowcaseItem(company.id, { ...data, images: newItemImages, type: companyType });
    }

    if (result.success) {
        toast.success(editingId ? "Item updated" : "Item added");
        setModalOpen(false);
        reset();
        setNewItemImages([]);
        setEditingId(null);
    } else {
        toast.error("Operation failed");
    }
    setShowcasePending(false);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setShowcasePending(true);
    try {
        await deleteShowcaseItem(itemToDelete);
        toast.success("Item deleted");
        setDeleteModalOpen(false);
        setItemToDelete(null);
    } catch (error) {
        toast.error("Failed to delete item");
    }
    setShowcasePending(false);
  };

  return (
    <div className="space-y-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div>
               <h1 className="text-3xl font-bold text-[#111827]">
                  {companyType === 'PRODUCT' ? 'Product Inventory' : 'Service Menu'}
               </h1>
               <p className="text-gray-500 mt-1">Manage the items displayed on your public profile.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
               
               {/* ✅ GHOST PLAN BADGE */}
               <div className="flex items-center gap-1.5 px-2 text-amber-500 shrink-0">
                   <Sparkles className="h-4 w-4 fill-amber-500/20" />
                   <span className="text-sm font-bold uppercase tracking-widest">{userPlan}</span>
               </div>

               {/* ✅ VERTICAL SEPARATOR */}
               <div className="hidden md:block h-6 w-px bg-gray-300 mx-1" />

               <div className="relative flex-1 md:w-64 min-w-[200px]">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                   <Input 
                      placeholder={`Search ${companyType === 'PRODUCT' ? 'products' : 'services'}...`} 
                      className="pl-9 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-[#0ABED6] h-10" 
                      defaultValue={currentQuery} 
                      onChange={(e) => handleSearch(e.target.value)} 
                   />
               </div>
               
               {hasAccess && (
                   <Button onClick={handleCreate} className="rounded-full bg-[#0ABED6] hover:bg-[#09A8BD] text-white gap-2 font-bold h-10 px-6 shrink-0">
                       <Plus className="h-4 w-4" /> Add Items
                   </Button>
               )}
            </div>
        </div>

        {!hasAccess ? (
            <div className="p-12 border border-dashed rounded-3xl bg-gray-50 text-center flex flex-col items-center justify-center gap-4 mt-8">
               <div className="p-4 bg-white rounded-full shadow-sm"><Lock className="h-8 w-8 text-gray-400" /></div>
               <div>
                  <h3 className="text-xl font-bold text-gray-900">Feature Locked</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">Upgrade to the Growth or Scale plan to unlock the product and service showcase feature.</p>
               </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                
                {/* --- LEFT COLUMN (2/3 width) --- */}
                <div className="xl:col-span-2 space-y-8">
                    
                    {/* 1. CONFIGURATION CARD */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-[#000032]">Business Type Configuration</h2>
                            {isTypeLocked && (
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                                    <Lock className="h-3.5 w-3.5" /> Selection Locked
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Setup</p>
                            <p className="text-lg font-bold text-gray-800">
                                You have chosen a {companyType === 'PRODUCT' ? 'product-based' : 'service-based'} business configuration.
                            </p>
                        </div>

                        <RadioGroup defaultValue={companyType} onValueChange={onTypeChange} disabled={isTypeLocked} className="flex flex-col gap-4 mt-6">
                            <Label 
                                htmlFor="r-service" 
                                className={`flex items-center space-x-3 rounded-xl p-5 border-2 transition-all cursor-pointer ${
                                    companyType === 'SERVICE' 
                                    ? 'bg-cyan-50/50 border-[#0ABED6]' 
                                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                                } ${isTypeLocked && companyType !== 'SERVICE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <RadioGroupItem value="SERVICE" id="r-service" className={companyType === 'SERVICE' ? "text-[#0ABED6] border-[#0ABED6]" : ""} />
                                <Briefcase className={`h-5 w-5 ${companyType === 'SERVICE' ? 'text-[#0ABED6]' : 'text-gray-400'}`} />
                                <span className="font-bold text-gray-800 text-base">Service Based</span>
                            </Label>

                            <Label 
                                htmlFor="r-product" 
                                className={`flex items-center space-x-3 rounded-xl p-5 border-2 transition-all cursor-pointer ${
                                    companyType === 'PRODUCT' 
                                    ? 'bg-cyan-50/50 border-[#0ABED6]' 
                                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                                } ${isTypeLocked && companyType !== 'PRODUCT' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <RadioGroupItem value="PRODUCT" id="r-product" className={companyType === 'PRODUCT' ? "text-[#0ABED6] border-[#0ABED6]" : ""} />
                                <Package className={`h-5 w-5 ${companyType === 'PRODUCT' ? 'text-[#0ABED6]' : 'text-gray-400'}`} />
                                <span className="font-bold text-gray-800 text-base">Product Based</span>
                            </Label>
                        </RadioGroup>

                        {!isTypeLocked ? (
                            <div className="flex items-start gap-2 text-sm font-medium text-blue-800 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                                <p>
                                    <strong>Choose wisely.</strong> Once you add your first item, this selection will be permanently locked to keep your public profile organized.
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <Info className="h-5 w-5 shrink-0 mt-0.5 text-gray-400" />
                                <p>
                                    Your business configuration is locked. If you need to switch between Product and Service based setups, please contact our support team.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 2. ALL ITEMS LIST CARD */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-[#000032]">All Items</h2>
                                <p className="text-sm text-gray-500 mt-1">Detailed list of every {companyType === 'PRODUCT' ? 'product' : 'service'} you offer.</p>
                            </div>
                            <div className="bg-gray-100 text-gray-700 text-sm font-bold px-4 py-1.5 rounded-full border border-gray-200">
                                Total: {filteredItems.length}
                            </div>
                        </div>

                        <div className="space-y-4">
                             {filteredItems.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    {currentQuery 
                                        ? "No items match your search." 
                                        : "No items added yet. Click 'Add Items' above to get started."}
                                </div>
                             ) : (
                                filteredItems.map((item: any) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
                                        
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            {/* Image Thumbnail */}
                                            {companyType === 'PRODUCT' && (
                                                <div className="relative h-16 w-24 shrink-0 rounded-xl overflow-hidden bg-[#2D333B]">
                                                    {item.images?.[0] ? (
                                                        <Image src={item.images[0]} alt="img" fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-gray-400" /></div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-lg truncate">{item.name}</h4>
                                                <p className="text-sm text-gray-500 truncate mt-0.5">{item.description}</p>
                                            </div>
                                        </div>

                                        {/* Status Tags & Actions */}
                                        <div className="flex items-center gap-4 sm:pl-4">
                                            <div className="hidden md:flex items-center gap-6 mr-4">
                                                <span className="text-sm font-bold text-[#0ABED6] truncate max-w-[120px]" title={item.name}>{item.name}</span>
                                                <span className="text-sm font-medium text-gray-400">Added {formatDate(item.createdAt)}</span>
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex items-center gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => handleEdit(item)} 
                                                    className="font-bold text-gray-700 hover:bg-gray-100 h-9 px-4 rounded-lg border-gray-200"
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteClick(item.id)} 
                                                    className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 h-9 w-9 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                             )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN (1/3 width) --- */}
                <div className="xl:col-span-1 space-y-8">
                    
                    {/* 3. PREVIEW CARD */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#000032]">Preview</h2>
                            <p className="text-sm text-gray-500 mt-1">How this item appears on your public profile.</p>
                        </div>

                        {previewItem ? (
                            <div 
                                onClick={() => setPreviewModalOpen(true)}
                                className="w-full max-w-[280px] mx-auto bg-white rounded-none border border-gray-200 overflow-hidden cursor-pointer transition-shadow group"
                            >
                                {/* Image Section */}
                                {companyType === 'PRODUCT' && (
                                    <div className="relative w-full h-56 bg-gray-50 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                                        {previewItem.images?.[0] ? (
                                            <Image 
                                                src={previewItem.images[0]} 
                                                alt="preview" 
                                                fill 
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <ImageIcon className="h-10 w-10 text-gray-300" />
                                        )}
                                    </div>
                                )}
                                
                                {/* Content Section */}
                                <div className="p-5 space-y-2">
                                    <h4 className="font-bold text-[#0ABED6] text-lg leading-tight line-clamp-1">
                                        {previewItem.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                        {previewItem.description}
                                    </p>
                                    
                                    {/* Action Link & Dynamic Date */}
                                    <div className="pt-3 flex justify-between items-center">
                                        <span className="text-xs font-extrabold text-[#0ABED6] uppercase tracking-wider group-hover:underline">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-400">Add an item to see a preview.</p>
                            </div>
                        )}
                    </div>

                    {/* 4. OVERVIEW CARD */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#000032]">Inventory Overview</h2>
                                <p className="text-sm text-gray-500 mt-1">Snapshot of your configured business type and items.</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                                All Items - {filteredItems.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business Type</p>
                                <p className="font-bold text-gray-900 text-sm leading-snug">
                                    {companyType === 'PRODUCT' ? 'Product Based' : 'Service Based'}<br/>
                                    <span className="text-gray-400 font-medium">({isTypeLocked ? 'Selection Locked' : 'Unlocked'})</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Visible Items</p>
                                <p className="font-bold text-gray-900 text-sm leading-snug">
                                    {filteredItems.length} Items on your<br/>
                                    <span className="text-gray-400 font-medium">public profile</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {/* --- MODAL FOR ADD/EDIT --- */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-xl p-8 rounded-3xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-[#000032]">{editingId ? "Edit" : "Add"} {companyType === 'SERVICE' ? 'Service' : 'Product'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Name</Label>
                        <Input {...register("name", { required: true })} className="bg-gray-50 border-gray-200" placeholder={`e.g. ${companyType === 'SERVICE' ? 'Web Design' : 'Ergonomic Chair'}`} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Description</Label>
                        <Textarea {...register("description", { required: true })} className="bg-gray-50 border-gray-200 min-h-[100px]" placeholder="Describe features and benefits..." />
                    </div>

                    {companyType === 'PRODUCT' && (
                        <>
                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">Link URL <span className="text-gray-400 font-normal">(Optional)</span></Label>
                                <Input {...register("linkUrl")} className="bg-gray-50 border-gray-200" placeholder="https://..." type="url" />
                            </div>

                            <div className="space-y-3">
                                <Label className="font-bold text-gray-700 block">Product Images (Max 2)</Label>
                                <div className="flex gap-4">
                                    {newItemImages.map((img, i) => (
                                        <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200 group">
                                            <Image src={img} alt="Product" fill className="object-cover" />
                                            <button type="button" onClick={() => setNewItemImages(prev => prev.filter((_, index) => index !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {newItemImages.length < 2 && (
                                        <div className="relative border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl h-24 w-24 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-50 hover:border-[#0ABED6] transition-colors">
                                            {isUploading ? (
                                                <Loader2 className="h-6 w-6 animate-spin text-[#0ABED6]" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Upload</span>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageUpload} 
                                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                                        title="Upload Image"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Button onClick={handleSubmit(onShowcaseSubmit)} className="w-full h-12 rounded-xl text-base font-bold bg-[#0ABED6] hover:bg-[#09A8BD] text-white" disabled={showcasePending || isUploading}>
                        {showcasePending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : editingId ? "Save Changes" : "Publish Item"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* --- DELETE CONFIRMATION DIALOG --- */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent className="sm:max-w-md p-8 rounded-3xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" /> Delete Item
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                        Are you sure you want to permanently delete this item? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3 sm:justify-start w-full">
                    <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="destructive" className="flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700" onClick={confirmDelete} disabled={showcasePending}>
                        {showcasePending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Yes, Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* --- LIVE PREVIEW MODAL --- */}
        <ShowcaseModal 
            isOpen={previewModalOpen} 
            onClose={() => setPreviewModalOpen(false)} 
            items={filteredItems} 
            initialStartIndex={0} 
            companyName={company.name} 
            companyLogo={company.logoImage} 
            type={companyType as "PRODUCT" | "SERVICE"} 
        />
    </div>
  );
}