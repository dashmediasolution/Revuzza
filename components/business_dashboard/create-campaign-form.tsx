"use client";

import { useActionState } from 'react';
import { createCampaign } from "@/lib/email-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin_components/blog-components/rich-text-editor";
import { Loader2, Save, ImagePlus, Lock, UserPlus, Link as LinkIcon, MousePointerClick, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface CampaignFormProps {
   userEmail: string;
   isLimitReached?: boolean;
   batchSizeLimit?: number; 
}

export function CreateCampaignForm({ userEmail, isLimitReached = false, batchSizeLimit = 50 }: CampaignFormProps) {
   const [state, formAction, isPending] = useActionState(createCampaign, null);
   const formRef = useRef<HTMLFormElement>(null);

   const [content, setContent] = useState("<p>Write your message here...</p>");
   const [logoPreview, setLogoPreview] = useState<string | null>(null);
   const [bannerPreview, setBannerPreview] = useState<string | null>(null);
   const [templateType, setTemplateType] = useState<"INVITE" | "PROMOTIONAL">("INVITE");
   const [actionType, setActionType] = useState("SEND");
   const [recipientCount, setRecipientCount] = useState(0);

   useEffect(() => {
      if (state?.success) {
         if (state.status === "DRAFT") toast.success("Campaign saved as draft.");
         // else if (state.partialSuccess) {
         //    toast.warning(state.message);
         //} 
         else {
            toast.success("Campaign sent successfully!");
         }
         
         formRef.current?.reset();
         setContent("<p>Write your message here...</p>");
         setLogoPreview(null);
         setBannerPreview(null);
         setTemplateType("INVITE");
         setRecipientCount(0);
      } else if (state?.error) {
         toast.error(state.error);
      }
   }, [state]);

   const handleImage = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (s: string | null) => void) => {
      const file = e.target.files?.[0];
      if (file) setPreview(URL.createObjectURL(file));
   };

   const handleRecipientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const count = val.split(/[\n,;]+/).filter(email => email.trim().length > 0).length;
      setRecipientCount(count);
   };

   const isBatchExceeded = batchSizeLimit !== Infinity && recipientCount > batchSizeLimit;

   return (
      <form ref={formRef} action={formAction} className="space-y-6">
         <input type="hidden" name="actionType" value={actionType} />
         <input type="hidden" name="templateType" value={templateType} />

         {/* --- TOP ROW: Split Grid (Left: 1 & 2, Right: 4) --- */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Takes up 2/3 of space) */}
            <div className="lg:col-span-2 space-y-6">
               
               {/* 1. Campaign Type */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#000032] text-lg">1. Campaign Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div
                        onClick={() => setTemplateType("INVITE")}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${templateType === "INVITE" ? "border-[#0ABED6] bg-cyan-50" : "border-gray-100 hover:border-cyan-100"}`}
                     >
                        <div className={`p-2 rounded-full ${templateType === "INVITE" ? "bg-[#0ABED6] text-white" : "bg-gray-100 text-gray-500"}`}>
                           <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-[#000032]">Review Invitation</h4>
                           <p className="text-xs text-gray-500 mt-1">Includes a "Rate Us" button automatically.</p>
                        </div>
                     </div>

                     <div
                        onClick={() => setTemplateType("PROMOTIONAL")}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${templateType === "PROMOTIONAL" ? "border-gray-300 bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
                     >
                        <div className={`p-2 rounded-full ${templateType === "PROMOTIONAL" ? "bg-gray-300 text-gray-700" : "bg-gray-100 text-gray-500"}`}>
                           <LinkIcon className="h-5 w-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-[#000032]">Promotional / Custom</h4>
                           <p className="text-xs text-gray-500 mt-1">You define the button and link.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 2. Campaign Details */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#000032] text-lg">2. Campaign Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label className="text-gray-600">Campaign Name</Label>
                        <Input name="name" placeholder="e.g. Summer Sale" className="bg-gray-50" required />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-gray-600">Subject Line</Label>
                        <Input name="subject" placeholder="e.g. A gift for you!" className="bg-gray-50" required />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-gray-600">Ready - To - Email</Label>
                     <Input name="senderEmail" defaultValue={userEmail} className="bg-gray-50" required />
                  </div>
               </div>
            </div>

            {/* Right Column (Takes up 1/3 of space, stretches full height) */}
            <div className="lg:col-span-1">
               {/* 4. Recipients */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold text-[#000032] text-lg">4. Recipients</h3>
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isBatchExceeded ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                        Count: {recipientCount} / {batchSizeLimit === Infinity ? "UNLMTD" : batchSizeLimit}
                     </span>
                  </div>
                  
                  <Textarea
                     name="recipients"
                     placeholder="Client1@gmail.com, Client2@yahoo.com"
                     className={`font-mono text-sm flex-1 min-h-[150px] resize-none bg-gray-50 ${isBatchExceeded ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                     onChange={handleRecipientsChange}
                  />
                  
                  {isBatchExceeded ? (
                     <div className="flex items-center gap-2 text-red-600 text-xs animate-in fade-in">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Batch limit exceeded. Reduce to {batchSizeLimit}.</span>
                     </div>
                  ) : (
                     <p className="text-[11px] text-gray-400">
                        {batchSizeLimit === Infinity 
                           ? "You can send unlimited emails in this batch." 
                           : `Max ${batchSizeLimit} recipients allowed per batch.`}
                     </p>
                  )}
               </div>
            </div>
         </div>

         {/* --- BOTTOM ROW: Full Width --- */}
         {/* 3. Design & Content */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-[#000032] text-lg">3. Design & Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Header Logo */}
               <div className="space-y-2">
                  <Label className="text-gray-600">Header Logo</Label>
                  <div className="flex items-center gap-4">
                     <div className="h-[42px] flex-1 rounded-md border border-gray-200 bg-gray-50 flex items-center px-3 overflow-hidden relative">
                        {logoPreview ? (
                           <Image src={logoPreview} alt="Logo" fill className="object-contain p-1" />
                        ) : (
                           <span className="text-sm text-gray-500">Default</span>
                        )}
                     </div>
                     <Label htmlFor="logo" className="cursor-pointer text-sm font-bold text-[#0ABED6] border border-[#0ABED6] rounded-md px-4 py-2 hover:bg-cyan-50 transition-colors">
                        Upload Custom
                     </Label>
                     <Input id="logo" name="logo" type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, setLogoPreview)} />
                  </div>
               </div>

               {/* Promotional Banner */}
               <div className="space-y-2">
                  <Label className="text-gray-600">Promotional Banner</Label>
                  <div className="relative w-full h-[42px] rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer">
                     {bannerPreview ? (
                        <Image src={bannerPreview} alt="Banner" fill className="object-cover" />
                     ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                           <ImagePlus className="h-4 w-4" />
                           <span className="text-sm font-medium">Upload Banner</span>
                        </div>
                     )}
                     <Input type="file" name="banner" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => handleImage(e, setBannerPreview)} />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <Label className="text-gray-600">Message Body</Label>
               <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                   <RichTextEditor value={content} onChange={setContent} />
               </div>
               <input type="hidden" name="htmlContent" value={content} />
            </div>

            {templateType === "PROMOTIONAL" && (
               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-gray-700 font-bold text-sm"><MousePointerClick className="h-4 w-4" /> Custom Button</div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2"><Label>Button Text</Label><Input name="customBtnText" placeholder="Shop Now" required /></div>
                     <div className="space-y-2"><Label>Target URL</Label><Input name="customBtnUrl" placeholder="https://..." required /></div>
                  </div>
               </div>
            )}
         </div>

         {/* --- Action Buttons --- */}
         <div className="flex justify-end gap-4 pb-10">
            <Button
               type="submit"
               variant="outline"
               disabled={isPending}
               onClick={() => setActionType("DRAFT")}
               className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border-gray-200 min-w-[140px] rounded-full font-bold"
            >
               {isPending && actionType === "DRAFT" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
               Save as Draft
            </Button>

            {isLimitReached ? (
               <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed flex items-center gap-2 rounded-full font-bold">
                  <Lock className="h-4 w-4" /> Monthly Limit Reached
               </Button>
            ) : (
               <Button
                  type="submit"
                  name="actionType"
                  value="SEND"
                  onClick={() => setActionType("SEND")}
                  disabled={isPending || isBatchExceeded}
                  className="bg-[#0ABED6] hover:bg-[#09A8BD] text-white min-w-[160px] rounded-full font-bold"
               >
                  {isPending && actionType === "SEND" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Campaign
               </Button>
            )}
         </div>
      </form>
   );
}