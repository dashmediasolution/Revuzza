'use client';

import React, { useState } from 'react';
import {
    User,
    Camera,
    Lock,
    CheckCircle2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateAdminDetails } from '@/lib/actions';
import Link from "next/link";


interface UserData {
    name: string;
    email: string;
    image?: string | null;
}

interface ModernAdminSettingsFormProps {
    userData: UserData;
    brandColor: string;
}

export default function ModernAdminSettingsForm({ userData, brandColor }: ModernAdminSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<UserData>({
        name: userData.name,
        email: userData.email,
        image: userData.image
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formDataObj = new FormData(event.currentTarget);

        setIsLoading(true);
        setMessage(null);
        setFieldErrors({});

        const result = await updateAdminDetails(null, formDataObj);
        console.log("Update Result:", result);
        setIsLoading(false);
        if (result.success && result.data) {
            setFormData({
                name: result.data.name || formData.name,
                email: result.data.email || formData.email,
                image: result.data.image || formData.image
            });
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } else {
            const errorText = result?.error || 'Failed to update settings';

            // Comprehensive error parsing - map server errors to specific fields
            const errorLower = errorText.toLowerCase();
            
            if (errorLower.includes('current password') || errorLower.includes('incorrect')) {
                setFieldErrors(prev => ({ ...prev, currentPassword: "The current password you entered is incorrect." }));
            }
            if (errorLower.includes('match') || errorLower.includes('do not match')) {
                setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match.", newPassword: "Passwords do not match." }));
            }
            if (errorLower.includes('at least 8 characters') || errorLower.includes('new password must be')) {
                setFieldErrors(prev => ({ ...prev, newPassword: "Password must be at least 8 characters." }));
            }
            if (errorLower.includes('email already in use') || errorLower.includes('email already') || errorLower.includes('email is already')) {
                setFieldErrors(prev => ({ ...prev, email: "This email is already in use by another user." }));
            }
            if (errorLower.includes('all password fields are required') || errorLower.includes('required')) {
                // Get password field values from the form event target
                const form = event.currentTarget;
                const currentPass = (form.elements.namedItem('currentPassword') as HTMLInputElement)?.value;
                const newPass = (form.elements.namedItem('newPassword') as HTMLInputElement)?.value;
                const confirmPass = (form.elements.namedItem('confirmPassword') as HTMLInputElement)?.value;
                
                if (!currentPass) setFieldErrors(prev => ({ ...prev, currentPassword: "Current password is required." }));
                if (!newPass) setFieldErrors(prev => ({ ...prev, newPassword: "New password is required." }));
                if (!confirmPass) setFieldErrors(prev => ({ ...prev, confirmPassword: "Confirm password is required." }));
            }
            if (errorLower.includes('name must be')) {
                setFieldErrors(prev => ({ ...prev, name: "Name must be at least 2 characters." }));
            }

            setMessage({ type: 'error', text: errorText });
        }
    }

    // Clear errors when typing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 font-sans text-slate-900">
            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Account{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${brandColor}, #000)`
                            }}
                        >
                            Settings
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage your profile and security preferences.
                    </p>
                </div>

                {/* ALERT */}
                {message && (
                    <div
                        className={`p-4 mb-6 rounded-xl flex items-center gap-3 shadow-sm border ${message.type === "success"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                            }`}
                    >
                        {message.type === "error" && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <p
                            className={`text-sm font-medium ${message.type === "success"
                                ? "text-green-700"
                                : "text-red-700"
                                }`}
                        >
                            {message.text}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">

                        {/* IDENTITY CARD */}
                        <Card className="rounded-2xl border mb-10 border-slate-200 shadow-sm backdrop-blur bg-white/80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <User className="w-4 h-4" style={{ color: brandColor }} />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">

                                    <div>
                                        <Label className="text-xs text-slate-500">Full Name</Label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`mt-1 h-12 rounded-xl border transition-all ${fieldErrors.name
                                                ? "border-red-500"
                                                : "border-slate-200 focus:border-black"
                                                }`}
                                        />
                                        {fieldErrors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {fieldErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-xs text-slate-500">Email</Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`mt-1 h-12 rounded-xl border transition-all ${fieldErrors.email
                                                ? "border-red-500"
                                                : "border-slate-200 focus:border-black"
                                                }`}
                                        />
                                        {fieldErrors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {fieldErrors.email}
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* SECURITY CARD */}
                        <Card className="rounded-2xl border border-slate-200 shadow-sm backdrop-blur bg-white/80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <Lock className="w-4 h-4" style={{ color: brandColor }} />
                                    Security
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                <div>
                                    <Label className="text-xs text-slate-500">
                                        Current Password
                                    </Label>
                                    <Input
                                        name="currentPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={handleInputChange}
                                        className={`mt-1 h-12 rounded-xl border ${fieldErrors.currentPassword
                                            ? "border-red-500"
                                            : "border-slate-200 focus:border-black"
                                            }`}
                                    />
                                    {fieldErrors.currentPassword && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {fieldErrors.currentPassword}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">

                                    <div>
                                        <Label className="text-xs text-slate-500">
                                            New Password
                                        </Label>
                                        <Input
                                            name="newPassword"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            onChange={handleInputChange}
                                            className={`mt-1 h-12 rounded-xl border ${fieldErrors.newPassword
                                                ? "border-red-500"
                                                : "border-slate-200 focus:border-black"
                                                }`}
                                        />
                                        {fieldErrors.newPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {fieldErrors.newPassword}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-xs text-slate-500">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            onChange={handleInputChange}
                                            className={`mt-1 h-12 rounded-xl border ${fieldErrors.confirmPassword
                                                ? "border-red-500"
                                                : "border-slate-200 focus:border-black"
                                                }`}
                                        />
                                        {fieldErrors.confirmPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {fieldErrors.confirmPassword}
                                            </p>
                                        )}
                                    </div>

                                </div>

                            </CardContent>
                        </Card>
                        <p className="text-sm text-slate-500 mt-2">
                            Can’t remember your current password?{" "}
                            <Link
                                href="/forgot-password"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Reset it here
                            </Link>
                        </p>
                        {/* FOOTER */}
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Secure encryption enabled
                            </p>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-12 px-8 rounded-xl font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                                style={{
                                    background: `linear-gradient(to right, ${brandColor}, #000)`
                                }}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}