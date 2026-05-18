import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CircuitState, ComponentValues } from "./types";

interface ControlsProps {
  state: CircuitState;
  onChange: (values: Partial<ComponentValues>) => void;
}

export function Controls({ state, onChange }: ControlsProps) {
  const { type, values } = state;

  const renderSlider = (id: keyof ComponentValues, label: string, min: number, max: number, step: number, unit: string) => {
    if (type === 'series' && !['v1', 'r1', 'r2'].includes(id)) return null;
    if (type === 'parallel' && !['v1', 'r1', 'r2'].includes(id)) return null;
    if (type === 'bridge' && !['v1', 'v2', 'r1', 'r2', 'r3'].includes(id)) return null;

    return (
      <div key={id} className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
          <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
            {values[id]} {unit}
          </span>
        </div>
        <Slider
          value={[values[id]]}
          min={min}
          max={max}
          step={step}
          onValueChange={([val]) => onChange({ [id]: val })}
          className="py-2"
        />
      </div>
    );
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Power Sources
          </h3>
          <div className="space-y-4">
            {renderSlider('v1', 'Battery V1', 1, 24, 1, 'V')}
            {renderSlider('v2', 'Battery V2', 1, 24, 1, 'V')}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Resistors
          </h3>
          <div className="space-y-4">
            {renderSlider('r1', 'Resistor R1', 0, 1000, 10, 'Ω')}
            {renderSlider('r2', 'Resistor R2', 0, 1000, 10, 'Ω')}
            {renderSlider('r3', 'Resistor R3', 0, 1000, 10, 'Ω')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
