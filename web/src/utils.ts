import {toast} from "sonner";
import type {ReactNode} from "react";

export function handleCatch(error: unknown) {
  toast.error(error instanceof Error ? error.message : String(error))
}

export function multiple(amount: number, mapFn: (index: number) => ReactNode): Array<ReactNode> {
  return [...Array(amount)].map((_, i) => mapFn(i));
}

export function noOp(){}