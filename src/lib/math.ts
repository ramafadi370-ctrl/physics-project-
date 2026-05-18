export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let k = 0; k < n; k++) {
    let i_max = k;
    let v_max = M[i_max][k];

    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > Math.abs(v_max)) {
        v_max = M[i][k];
        i_max = i;
      }
    }

    if (i_max !== k) {
      const temp = M[k];
      M[k] = M[i_max];
      M[i_max] = temp;
    }

    for (let i = k + 1; i < n; i++) {
      const factor = M[i][k] / M[k][k];
      for (let j = k + 1; j <= n; j++) {
        M[i][j] -= M[k][j] * factor;
      }
      M[i][k] = 0;
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += M[i][j] * x[j];
    }
    x[i] = (M[i][n] - sum) / M[i][i];
  }

  return x;
}
