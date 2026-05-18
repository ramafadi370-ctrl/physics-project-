import { CircuitState, CircuitResults } from "./types";
import { useRef } from "react";

interface CircuitCanvasProps {
  state: CircuitState;
  results: CircuitResults;
}

export function CircuitCanvas({ state, results }: CircuitCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 600;
  const H = 400;
  const strokeW = 2;
  const strokeC = "hsl(var(--muted-foreground))";

  const Resistor = ({ x, y, vertical = false, label, val }: { x: number, y: number, vertical?: boolean, label: string, val: number }) => {
    const l = 40;
    const w = 12;
    const pts = vertical 
      ? `0,-${l/2} ${w},-${l/3} -${w},-${l/6} ${w},${l/6} -${w},${l/3} 0,${l/2}`
      : `-${l/2},0 -${l/3},-${w} -${l/6},${w} ${l/6},-${w} ${l/3},${w} ${l/2},0`;
      
    return (
      <g transform={`translate(${x},${y})`}>
        <polyline points={pts} fill="none" stroke="hsl(var(--foreground))" strokeWidth={strokeW} strokeLinejoin="bevel" />
        <rect x={vertical ? -20 : -l/2} y={vertical ? -l/2 : -20} width={vertical ? 40 : l} height={vertical ? l : 40} fill="transparent" />
        <text x={vertical ? 20 : 0} y={vertical ? 0 : -20} fill="hsl(var(--foreground))" fontSize="12" fontFamily="monospace" textAnchor={vertical ? "start" : "middle"} dominantBaseline="middle">
          {label}
        </text>
        <text x={vertical ? 20 : 0} y={vertical ? 15 : 20} fill="hsl(var(--primary))" fontSize="11" fontFamily="monospace" textAnchor={vertical ? "start" : "middle"} dominantBaseline="middle">
          {val}Ω
        </text>
      </g>
    );
  };

  const Battery = ({ x, y, label, val, reversed = false }: { x: number, y: number, label: string, val: number, reversed?: boolean }) => {
    const longPlate = 22;
    const shortPlate = 14;
    const plateGap = 7;
    const leadLen = 16;

    const topPlate = reversed ? shortPlate : longPlate;
    const botPlate = reversed ? longPlate : shortPlate;
    const topStroke = reversed ? strokeW + 1 : strokeW;
    const botStroke = reversed ? strokeW : strokeW + 1;

    return (
      <g transform={`translate(${x},${y})`}>
        <line x1={0} y1={-leadLen - plateGap} x2={0} y2={-plateGap} stroke="hsl(var(--foreground))" strokeWidth={strokeW} />
        <line x1={-topPlate/2} y1={-plateGap} x2={topPlate/2} y2={-plateGap} stroke="hsl(var(--foreground))" strokeWidth={topStroke} />
        <line x1={-botPlate/2} y1={plateGap} x2={botPlate/2} y2={plateGap} stroke="hsl(var(--foreground))" strokeWidth={botStroke + 1} />
        <line x1={0} y1={plateGap} x2={0} y2={leadLen + plateGap} stroke="hsl(var(--foreground))" strokeWidth={strokeW} />
        <text x={topPlate/2 + 6} y={-plateGap + 4} fill="hsl(var(--foreground))" fontSize="11" textAnchor="start" dominantBaseline="middle">{reversed ? "-" : "+"}</text>
        <text x={botPlate/2 + 6} y={plateGap + 4} fill="hsl(var(--foreground))" fontSize="11" textAnchor="start" dominantBaseline="middle">{reversed ? "+" : "-"}</text>
        <text x={-topPlate/2 - 6} y={0} fill="hsl(var(--foreground))" fontSize="12" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">{label}</text>
        <text x={-topPlate/2 - 6} y={14} fill="hsl(var(--primary))" fontSize="11" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">{val}V</text>
      </g>
    );
  };

  const renderSeries = () => (
    <g>
      <path d={`M 150 200 L 150 100 L 450 100 L 450 300 L 150 300 Z`} fill="none" stroke={strokeC} strokeWidth={strokeW} />
      <rect x="128" y="191" width="44" height="18" fill="hsl(var(--background))" />
      <Battery x={150} y={200} label="V1" val={state.values.v1} />
      <rect x="280" y="90" width="40" height="20" fill="hsl(var(--background))" />
      <Resistor x={300} y={100} label="R1" val={state.values.r1} />
      <rect x="280" y="290" width="40" height="20" fill="hsl(var(--background))" />
      <Resistor x={300} y={300} label="R2" val={state.values.r2} />
      {results.valid && (
        <path d={`M 150 160 L 150 100 L 450 100 L 450 300 L 150 300 L 150 240`} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 8" className="animate-circuit-flow opacity-50" />
      )}
    </g>
  );

  const renderParallel = () => (
    <g>
      <path d={`M 150 200 L 150 100 L 450 100 L 450 300 L 150 300 Z`} fill="none" stroke={strokeC} strokeWidth={strokeW} />
      <line x1={300} y1={100} x2={300} y2={300} stroke={strokeC} strokeWidth={strokeW} />
      <circle cx={300} cy={100} r={4} fill="hsl(var(--foreground))" />
      <circle cx={300} cy={300} r={4} fill="hsl(var(--foreground))" />
      <rect x="128" y="191" width="44" height="18" fill="hsl(var(--background))" />
      <Battery x={150} y={200} label="V1" val={state.values.v1} />
      <rect x="290" y="180" width="20" height="40" fill="hsl(var(--background))" />
      <Resistor x={300} y={200} vertical label="R1" val={state.values.r1} />
      <rect x="440" y="180" width="20" height="40" fill="hsl(var(--background))" />
      <Resistor x={450} y={200} vertical label="R2" val={state.values.r2} />
      {results.valid && (
        <>
          <path d={`M 150 160 L 150 100 L 300 100`} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 8" className="animate-circuit-flow opacity-50" />
          <path d={`M 300 100 L 300 180`} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 8" className="animate-circuit-flow opacity-50" />
          <path d={`M 300 100 L 450 100 L 450 180`} fill="none" stroke="hsl(var(--chart-4))" strokeWidth="2" strokeDasharray="4 8" className="animate-circuit-flow opacity-50" />
        </>
      )}
    </g>
  );

  const renderBridge = () => (
    <g>
      <rect x={150} y={100} width={300} height={200} fill="none" stroke={strokeC} strokeWidth={strokeW} />
      <line x1={300} y1={100} x2={300} y2={300} stroke={strokeC} strokeWidth={strokeW} />
      <circle cx={300} cy={100} r={4} fill="hsl(var(--foreground))" />
      <circle cx={300} cy={300} r={4} fill="hsl(var(--foreground))" />
      <path d={`M 155 105 L 295 105 L 295 295 L 155 295 Z`} fill="hsl(var(--primary)/0.05)" />
      <path d={`M 305 105 L 445 105 L 445 295 L 305 295 Z`} fill="hsl(var(--chart-4)/0.05)" />
      <rect x="128" y="191" width="44" height="18" fill="hsl(var(--background))" />
      <Battery x={150} y={200} label="V1" val={state.values.v1} />
      <rect x="200" y="90" width="40" height="20" fill="hsl(var(--background))" />
      <Resistor x={220} y={100} label="R1" val={state.values.r1} />
      <rect x="290" y="180" width="20" height="40" fill="hsl(var(--background))" />
      <Resistor x={300} y={200} vertical label="R3" val={state.values.r3} />
      <rect x="440" y="180" width="20" height="40" fill="hsl(var(--background))" />
      <Battery x={450} y={200} label="V2" val={state.values.v2} reversed />
      <rect x="360" y="90" width="40" height="20" fill="hsl(var(--background))" />
      <Resistor x={380} y={100} label="R2" val={state.values.r2} />
    </g>
  );

  return (
    <svg 
      ref={svgRef} 
      viewBox={`0 0 ${W} ${H}`} 
      className="w-full h-full text-foreground max-w-full"
      style={{ '--circuit-flow-speed': '2s' } as React.CSSProperties}
    >
      <style>
        {`
          @keyframes circuit-flow {
            to { stroke-dashoffset: -24; }
          }
          .animate-circuit-flow {
            animation: circuit-flow var(--circuit-flow-speed) linear infinite;
          }
        `}
      </style>
      
      {state.type === 'series' && renderSeries()}
      {state.type === 'parallel' && renderParallel()}
      {state.type === 'bridge' && renderBridge()}
    </svg>
  );
}
