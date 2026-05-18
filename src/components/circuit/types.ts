export type CircuitType = 'series' | 'parallel' | 'bridge';

export interface ComponentValues {
  v1: number;
  v2: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
}

export interface CircuitState {
  type: CircuitType;
  values: ComponentValues;
}

export interface CircuitResults {
  currents: number[];
  voltageDrops: number[];
  powers: number[];
  meshCurrents: number[];
  totalResistance: number;
  totalCurrent: number;
  valid: boolean;
  message?: string;
}
