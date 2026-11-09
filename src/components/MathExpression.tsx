/** An arithmetic expression such as "5 + 2 =" or "7 − 2 = ?" (the plain minus "-" is accepted too). */
const EXPRESSION = /^\s*(\d+)\s*([+\u2212-])\s*(\d+)\s*=\s*\??\s*$/;

export function isMathExpression(value: string | null | undefined): value is string {
  return !!value && EXPRESSION.test(value);
}

/**
 * Draws the expression the server generated as large text in the middle of the picture area (instead of an <img>).
 * The client only shows it: the result is decided and graded by the server.
 */
export default function MathExpression({ value }: { value: string }) {
  const parts = EXPRESSION.exec(value);
  if (!parts) return null;
  const [, left, operator, right] = parts;
  const sign = operator === '-' ? '\u2212' : operator;
  return <div className="math-expression" role="img" aria-label={`${left} ${sign} ${right} =`}>
    <span className="math-number" aria-hidden="true">{left}</span>
    <span className="math-operator" aria-hidden="true">{sign}</span>
    <span className="math-number" aria-hidden="true">{right}</span>
    <span className="math-equals" aria-hidden="true">=</span>
  </div>;
}
