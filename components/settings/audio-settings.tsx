"use client";

import { useAudio } from '@/hooks/useAudio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function AudioSettings() {
  const { settings, setSettings, voices } = useAudio();

  const handleVoiceChange = (voiceName: string) => {
    setSettings({ voice: voiceName });
  };

  const handleRateChange = (value: number[]) => {
    setSettings({ rate: value[0] });
  };

  const handlePitchChange = (value: number[]) => {
    setSettings({ pitch: value[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajustes de Áudio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="voice-select">Voz</Label>
          <Select
            value={settings.voice || ''}
            onValueChange={handleVoiceChange}
            disabled={voices.length === 0}
          >
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Carregando vozes..." />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {`${voice.name} (${voice.lang})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate-slider">Velocidade ({settings.rate.toFixed(1)}x)</Label>
          <Slider
            id="rate-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={[settings.rate]}
            onValueChange={handleRateChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pitch-slider">Tom ({settings.pitch.toFixed(1)})</Label>
          <Slider
            id="pitch-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={[settings.pitch]}
            onValueChange={handlePitchChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
