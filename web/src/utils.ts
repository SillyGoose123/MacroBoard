import {toast} from "sonner";

export function handleCatch(error: unknown) {
  toast.error(error instanceof Error ? error.message : String(error))
}