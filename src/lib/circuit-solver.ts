import { CircuitState, CircuitResults } from "@/components/circuit/types";
import { solveLinearSystem } from "@/lib/math";

export function solveCircuit(state: CircuitState): CircuitResults {
  const { type, values } = state;
  const { v1, v2, r1, r2, r3 } = values;

  const defaultResults: CircuitResults = {
    currents: [],
    voltageDrops: [],
    powers: [],
    meshCurrents: [],
    totalResistance: 0,
    totalCurrent: 0,
    valid: true,
  };

  try {
    if (type === 'series') {
      if (r1 + r2 === 0) throw new Error("Short circuit detected: Total resistance is 0Ω");
      
      const rTotal = r1 + r2;
      const i = v1 / rTotal;
      
      return {
        ...defaultResults,
        currents: [i, i],
        voltageDrops: [i * r1, i * r2],
        powers: [i * i * r1, i * i * r2],
        totalResistance: rTotal,
        totalCurrent: i,
      };
    } 
    
    else if (type === 'parallel') {
      if (r1 === 0) throw new Error("Short circuit detected in Branch 1 (R1 = 0Ω)");
      if (r2 === 0) throw new Error("Short circuit detected in Branch 2 (R2 = 0Ω)");
      
      const rTotal = 1 / (1/r1 + 1/r2);
      const iTotal = v1 / rTotal;
      const i1 = v1 / r1;
      const i2 = v1 / r2;
      
      return {
        ...defaultResults,
        currents: [i1, i2],
        voltageDrops: [v1, v1],
        powers: [i1 * i1 * r1, i2 * i2 * r2],
        totalResistance: rTotal,
        totalCurrent: iTotal,
      };
    }
    
    else if (type === 'bridge') {
      if (r1 + r3 === 0 || r2 + r3 === 0) throw new Error("Short circuit detected in loops");
      
      const A = [
        [r1 + r3, -r3],
        [-r3, r2 + r3]
      ];
      const b = [v1, -v2];
      
      const meshCurrents = solveLinearSystem(A, b);
      const i1 = meshCurrents[0];
      const i2 = meshCurrents[1];
      
      const ir1 = i1;
      const ir2 = i2;
      const ir3 = i1 - i2;
      
      return {
        ...defaultResults,
        meshCurrents: [i1, i2],
        currents: [ir1, ir2, ir3],
        voltageDrops: [Math.abs(ir1 * r1), Math.abs(ir2 * r2), Math.abs(ir3 * r3)],
        powers: [ir1 * ir1 * r1, ir2 * ir2 * r2, ir3 * ir3 * r3],
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ...defaultResults, valid: false, message };
  }
  
  return defaultResults;
}
