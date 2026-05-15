"use client";

import { useActionState } from 'react';
import { updateCompanyProfile } from "@/lib/actions";
import { uploadShowcaseImage } from "@/lib/showcase-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, ImageIcon, Save, MapPin, Phone, Mail, Globe, UploadCloud, X, Sparkles
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Country, State, City }  from 'country-state-city';
import { Prisma } from "@prisma/client"; 

// Define Types
type CompanyWithShowcase = Prisma.CompanyGetPayload<{
  include: { showcaseItems: true }
}>;

interface CategoryWithSubs {
  id: string;
  name: string;
  subCategories: { id: string; name: string }[];
}

interface SettingsFormProps {
  company: CompanyWithShowcase;
  categories: CategoryWithSubs[];
}

export function SettingsForm({ company, categories }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateCompanyProfile, null);
  const router = useRouter();
  
  // Image State
  const [logoPreview, setLogoPreview] = useState<string | null>(company.logoImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>(company.otherImages || []);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const openGalleryInput = () => {
    galleryInputRef.current?.click();
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setGalleryUploading(true);

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each image must be under 5MB.");
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadShowcaseImage(formData);
      if (result.success && result.url) {
        setGalleryImageUrls((prev) => [...prev, result.url]);
        toast.success("Image uploaded");
      } else {
        toast.error(result.error || "Upload failed.");
      }
    }

    if (galleryInputRef.current) galleryInputRef.current.value = "";
    setGalleryUploading(false);
  };

  // Category State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(company.categoryId || "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(company.subCategoryId || "");

  const activeSubCategories = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId)?.subCategories || [];
  }, [selectedCategoryId, categories]);

  // Location State
  const [selectedCountryISO, setSelectedCountryISO] = useState<string>(""); 
  const [selectedStateISO, setSelectedStateISO] = useState<string>(""); 
  const [selectedCityName, setSelectedCityName] = useState<string>(company.city || "");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => selectedCountryISO ? State.getStatesOfCountry(selectedCountryISO) : [], [selectedCountryISO]);
  const cities = useMemo(() => selectedStateISO ? City.getCitiesOfState(selectedCountryISO, selectedStateISO) : [], [selectedCountryISO, selectedStateISO]);

  // Fetch Plan for Badge
  const userPlan = company.plan || "FREE";

  // Hydrate Location
  useEffect(() => {
    if (company.country) {
      const dbCountry = company.country.trim().toLowerCase();
      const foundCountry = countries.find(
        c => c.name.toLowerCase() === dbCountry || c.isoCode.toLowerCase() === dbCountry
      );
      if (foundCountry) {
        setSelectedCountryISO(foundCountry.isoCode);
        if (company.state) {
          const dbState = company.state.trim().toLowerCase();
          const validStates = State.getStatesOfCountry(foundCountry.isoCode);
          const foundState = validStates.find(
            s => s.name.toLowerCase() === dbState || s.isoCode.toLowerCase() === dbState
          );
          if (foundState) setSelectedStateISO(foundState.isoCode);
        }
      }
    }
    if (company.city) setSelectedCityName(company.city);
  }, [company.country, company.state, company.city, countries]); 

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile updated successfully!");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  // Actions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form action={formAction} className="space-y-8">
      
      {/* HIDDEN INPUTS */}
      <input type="hidden" name="country" value={countries.find(c => c.isoCode === selectedCountryISO)?.name || ""} />
      <input type="hidden" name="state" value={states.find(s => s.isoCode === selectedStateISO)?.name || ""} />
      <input type="hidden" name="city" value={selectedCityName} />
      <input type="hidden" name="companyId" value={company.id} />
      <input type="hidden" name="categoryId" value={selectedCategoryId} />
      <input type="hidden" name="subCategoryId" value={selectedSubCategoryId} />

      {/* --- HEADER BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-[#111827]">Edit Profile</h1>
            <p className="text-gray-500 mt-1">Update your contact details, location, and business information visible to the public.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* ✅ GHOST PLAN BADGE */}
            <div className="flex items-center gap-1.5 px-2 text-amber-500">
                <Sparkles className="h-4 w-4 fill-amber-500/20" />
                <span className="text-sm font-bold uppercase tracking-widest">{userPlan}</span>
            </div>

            {/* ✅ VERTICAL SEPARATOR */}
            <div className="hidden md:block h-6 w-px bg-gray-300 mx-1" />

            <Button 
                type="submit" 
                disabled={isPending} 
                className="rounded-xl font-bold h-11 px-6 bg-[#0ABED6] hover:bg-[#09A8BD] text-white shadow-sm flex-1 md:flex-none"
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save All Changes
            </Button>
        </div>
      </div>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN (1/3) */}
          <div className="xl:col-span-1 space-y-8">
              
              {/* BRANDING CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                      <h2 className="text-xl font-bold text-[#000032]">Branding</h2>
                      <p className="text-sm text-gray-500 mt-1">Update your company logo and visual identity.</p>
                  </div>
                  
                  <div className="flex items-start gap-5">
                      {/* Square Image Box like Figma */}
                      <div className="relative w-24 h-24 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                          {logoPreview ? (
                              <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                          ) : (
                              <ImageIcon className="h-8 w-8 text-gray-300" />
                          )}
                      </div>
                      
                      <div className="space-y-3 flex-1">
                          <Label className="text-sm font-bold text-gray-700">Company Logo</Label>
                          <div className="flex flex-wrap items-center gap-2">
                              {/* Upload Button */}
                              <div className="relative overflow-hidden inline-block">
                                  <input 
                                      type="file" 
                                      name="logo" 
                                      accept="image/*" 
                                      ref={fileInputRef}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                                      onChange={handleImageChange} 
                                  />
                                  <Button type="button" variant="outline" className="font-bold border-gray-200 text-gray-700 rounded-lg h-9 px-4">
                                      <UploadCloud className="h-4 w-4 mr-2" /> Upload New Logo
                                  </Button>
                              </div>
                              
                              {/* Remove Button */}
                              <Button 
                                  type="button" 
                                  variant="ghost" 
                                  onClick={handleRemoveLogo}
                                  className="font-bold text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg h-9 px-4"
                              >
                                  <X className="h-4 w-4 mr-2" /> Remove
                              </Button>
                          </div>
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Recommended: 400x400px (JPG, PNG)</p>
                      </div>
                  </div>
              </div>

              {/* COMPANY IMAGES CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                      <h2 className="text-xl font-bold text-[#000032]">Company Images</h2>
                      <p className="text-sm text-gray-500 mt-1">Upload multiple business photos for your public listing. Click the button again to select more images.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <Button
                          type="button"
                          variant="outline"
                          className="font-bold border-gray-200 text-gray-700 rounded-lg h-11 px-5"
                          onClick={openGalleryInput}
                          disabled={galleryUploading}
                      >
                          <UploadCloud className="h-4 w-4 mr-2" />
                          {galleryUploading ? 'Uploading...' : 'Select Images'}
                      </Button>
                      <p className="text-sm text-gray-500">Recommended: JPG/PNG, max 5MB per image.</p>
                  </div>

                  <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFiles}
                      className="hidden"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryImageUrls.length > 0 ? (
                          galleryImageUrls.map((src, index) => (
                              <div key={`${src}-${index}`} className="relative h-28 rounded-3xl overflow-hidden border border-gray-200 bg-gray-50">
                                  <img src={src} alt={`Company Image ${index + 1}`} className="h-full w-full object-cover" />
                              </div>
                          ))
                      ) : (
                          <div className="col-span-2 sm:col-span-3 rounded-3xl border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
                              No images uploaded yet. Click "Select Images" to add photos.
                          </div>
                      )}
                  </div>

                  {galleryImageUrls.map((url, index) => (
                      <input key={`${url}-hidden-${index}`} type="hidden" name="otherImages" value={url} />
                  ))}
              </div>

              {/* PUBLIC CONTACT CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                      <h2 className="text-xl font-bold text-[#000032]">Public Contact</h2>
                      <p className="text-sm text-gray-500 mt-1">How customers can reach you.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email (Left) */}
                      <div className="space-y-2">
                          <Label htmlFor="publicEmail" className="text-sm font-bold text-gray-700">Public Email</Label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              {/* @ts-ignore */}
                              <Input id="publicEmail" name="publicEmail" defaultValue={company.contact?.email || ""} className="pl-10 bg-gray-50 border-gray-200" placeholder="support@domain.com" />
                          </div>
                      </div>
                      
                      {/* Phone (Right) */}
                      <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-sm font-bold text-gray-700">Phone Number</Label>
                          <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              {/* @ts-ignore */}
                              <Input id="phoneNumber" name="phoneNumber" defaultValue={company.contact?.phone || ""} className="pl-10 bg-gray-50 border-gray-200" placeholder="+1 234 567 890" />
                          </div>
                      </div>
                  </div>

                  {/* Website (Full Width) */}
                  <div className="space-y-2">
                      <Label htmlFor="websiteUrl" className="text-sm font-bold text-gray-700">Website</Label>
                      <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input id="websiteUrl" name="websiteUrl" defaultValue={company.websiteUrl || ""} className="pl-10 bg-gray-50 border-gray-200" placeholder="www.yourwebsite.com" />
                      </div>
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN (2/3) */}
          <div className="xl:col-span-2 space-y-8">
              
              {/* BUSINESS DETAILS CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                      <h2 className="text-xl font-bold text-[#000032]">Business Details</h2>
                      <p className="text-sm text-gray-500 mt-1">Categorize your business and describe what you do.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-700">Category</Label>
                          <Select value={selectedCategoryId} onValueChange={(val) => { setSelectedCategoryId(val); setSelectedSubCategoryId(""); }}>
                              <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Category" /></SelectTrigger>
                              <SelectContent>
                                  {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      
                      <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-700">Subcategory</Label>
                          <Select value={selectedSubCategoryId} onValueChange={setSelectedSubCategoryId} disabled={!selectedCategoryId}>
                              <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Subcategory" /></SelectTrigger>
                              <SelectContent>
                                  {activeSubCategories.map((sub) => <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-bold text-gray-700">About the Business</Label>
                      <Textarea 
                          id="description" 
                          name="description" 
                          defaultValue={company.briefIntroduction || ""} 
                          placeholder="Describe your expertise, what makes you unique, and the services you offer..."
                          className="min-h-[140px] bg-gray-50 border-gray-200 leading-relaxed resize-y custom-scrollbar"
                      />
                  </div>
              </div>

              {/* LOCATION CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                      <h2 className="text-xl font-bold text-[#000032]">Location</h2>
                      <p className="text-sm text-gray-500 mt-1">Where is your business headquarters located?</p>
                  </div>
                  
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="address" className="text-sm font-bold text-gray-700">Address</Label>
                          <Input id="address" name="address" defaultValue={company.address || ""} placeholder="A - 2, First Floor, Shankar Garden..." className="bg-gray-50 border-gray-200" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <Label className="text-sm font-bold text-gray-700">Country</Label>
                              <Select value={selectedCountryISO} onValueChange={(val) => { setSelectedCountryISO(val); setSelectedStateISO(""); setSelectedCityName(""); }}>
                                  <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Country" /></SelectTrigger>
                                  <SelectContent>
                                      {countries.map((c) => <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                          
                          <div className="space-y-2">
                              <Label className="text-sm font-bold text-gray-700">State / Province</Label>
                              <Select value={selectedStateISO } onValueChange={(val) => { setSelectedStateISO(val); setSelectedCityName(""); }} disabled={!selectedCountryISO}>
                                  <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select State" /></SelectTrigger>
                                  <SelectContent>
                                      {states.map((s) => <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                          
                          <div className="space-y-2">
                              <Label className="text-sm font-bold text-gray-700">City</Label>
                              <Select value={selectedCityName} onValueChange={setSelectedCityName} disabled={!selectedStateISO}>
                                  <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select City" /></SelectTrigger>
                                  <SelectContent>
                                      {cities.map((city) => <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                          
                          <div className="space-y-2">
                              <Label htmlFor="subCity" className="text-sm font-bold text-gray-700">Sub City / Area</Label>
                              <Input 
                                  id="subCity" 
                                  name="subCity" 
                                  defaultValue={company.subCity || ""} 
                                  placeholder="e.g. Downtown"
                                  className="bg-gray-50 border-gray-200"
                              />
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </form>
  );
}