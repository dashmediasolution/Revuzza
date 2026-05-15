import React from 'react';
import { auth } from '@/auth';
import ModernAdminSettingsForm from './ModernAdminSettingsForm';

export default async function ModernAdminSettings() {
  const brandColor = "#00B5D8";
  const session = await auth();
  
  const userData = {
    name: session?.user?.name || '',
    email: session?.user?.email || ''
  };

  return <ModernAdminSettingsForm userData={userData} brandColor={brandColor} />;
}