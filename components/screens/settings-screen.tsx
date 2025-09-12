"use client";

import { AppLayout } from '@/components/app-layout';
import { AudioSettings } from '@/components/settings/audio-settings';
import { useRouter } from 'next/navigation';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <AppLayout title="Ajustes" onBack={() => router.back()}>
      <div className="p-4 space-y-4">
        <AudioSettings />
        {/* Outras configurações gerais podem ser adicionadas aqui no futuro */}
      </div>
    </AppLayout>
  );
}
