import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircuitState, CircuitType } from "@/components/circuit/types";
import { Controls } from "@/components/circuit/Controls";
import { Equations } from "@/components/circuit/Equations";
import { CircuitCanvas } from "@/components/circuit/CircuitCanvas";
import { solveCircuit } from "@/lib/circuit-solver";

const DEFAULT_STATE: CircuitState = {
  type: 'series',
  values: {
    v1: 9,
    v2: 5,
    r1: 100,
    r2: 220,
    r3: 330,
    r4: 100,
    r5: 100
  }
};

export default function CircuitSimulator() {
  const [state, setState] = useState<CircuitState>(DEFAULT_STATE);

  const results = useMemo(() => solveCircuit(state), [state]);

  const handleTypeChange = (type: CircuitType) => {
    setState(prev => ({ ...prev, type }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Kirchhoff Circuit Simulator</h2>
          <p className="text-muted-foreground mt-1">Explore current flow and voltage drops in real-time.</p>
        </div>

        <div className="flex bg-muted/50 p-1 rounded-md border border-border">
          {(['series', 'parallel', 'bridge'] as CircuitType[]).map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                state.type === type 
                  ? 'bg-card text-foreground shadow-sm border border-border' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6">
          <Card className="border-border bg-black/20 overflow-hidden relative min-h-[400px] flex items-center justify-center">
            <CircuitCanvas state={state} results={results} />
          </Card>
          
          <Equations state={state} results={results} />
        </div>

        <div className="sticky top-6">
          <Controls 
            state={state} 
            onChange={(newValues) => setState(prev => ({ 
              ...prev, 
              values: { ...prev.values, ...newValues } 
            }))} 
          />
        </div>
      </div>
    </div>
  );
}
