import { CircuitState, CircuitResults } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface EquationsProps {
  state: CircuitState;
  results: CircuitResults;
}

export function Equations({ state, results }: EquationsProps) {
  const { type, values } = state;

  if (!results.valid) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-destructive">Circuit Error</h4>
            <p className="text-sm text-destructive/80 mt-1">{results.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm uppercase tracking-wider font-semibold">Kirchhoff's Laws Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 space-y-4">
              {type === 'series' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-primary">KVL</span>
                    <span>Sum of voltage drops equals source voltage</span>
                  </div>
                  <div className="bg-black/40 rounded p-3 font-mono text-sm border border-border">
                    <div className="text-muted-foreground">V - I·R₁ - I·R₂ = 0</div>
                    <div className="mt-2 text-foreground">
                      {values.v1} - {results.currents[0].toFixed(3)}·{values.r1} - {results.currents[0].toFixed(3)}·{values.r2} = 0
                      <CheckCircle2 className="inline w-4 h-4 text-emerald-500 ml-2" />
                    </div>
                  </div>
                </div>
              )}

              {type === 'parallel' && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono text-amber-500">KCL</span>
                      <span>Total current splits at the junction</span>
                    </div>
                    <div className="bg-black/40 rounded p-3 font-mono text-sm border border-border">
                      <div className="text-muted-foreground">I_total = I₁ + I₂</div>
                      <div className="mt-2 text-foreground">
                        {results.totalCurrent.toFixed(3)} = {results.currents[0].toFixed(3)} + {results.currents[1].toFixed(3)}
                        <CheckCircle2 className="inline w-4 h-4 text-emerald-500 ml-2" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono text-primary">KVL</span>
                      <span>Voltage is identical across parallel branches</span>
                    </div>
                    <div className="bg-black/40 rounded p-3 font-mono text-sm border border-border">
                      <div className="text-muted-foreground">V = V₁ = V₂</div>
                      <div className="mt-2 text-foreground">
                        {values.v1}V = {results.voltageDrops[0].toFixed(2)}V = {results.voltageDrops[1].toFixed(2)}V
                        <CheckCircle2 className="inline w-4 h-4 text-emerald-500 ml-2" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {type === 'bridge' && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono text-primary">Mesh 1 (Left)</span>
                    </div>
                    <div className="bg-black/40 rounded p-3 font-mono text-sm border border-border">
                      <div className="text-muted-foreground">V₁ - I₁R₁ - (I₁-I₂)R₃ = 0</div>
                      <div className="mt-2 text-foreground">
                        I₁ = {results.meshCurrents[0]?.toFixed(3) ?? "0.000"}A
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono text-amber-500">Mesh 2 (Right)</span>
                    </div>
                    <div className="bg-black/40 rounded p-3 font-mono text-sm border border-border">
                      <div className="text-muted-foreground">-V₂ - I₂R₂ - (I₂-I₁)R₃ = 0</div>
                      <div className="mt-2 text-foreground">
                        I₂ = {results.meshCurrents[1]?.toFixed(3) ?? "0.000"}A
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm uppercase tracking-wider font-semibold">Component Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[100px]">Comp</TableHead>
                  <TableHead className="text-right">Voltage (V)</TableHead>
                  <TableHead className="text-right">Current (mA)</TableHead>
                  <TableHead className="text-right">Power (mW)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.currents.map((current, i) => (
                  <TableRow key={i} className="border-border/50 border-b-0 hover:bg-white/5">
                    <TableCell className="font-mono font-medium text-muted-foreground">
                      R{i + 1}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {results.voltageDrops[i].toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-primary">
                      {(Math.abs(current) * 1000).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      {(results.powers[i] * 1000).toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
