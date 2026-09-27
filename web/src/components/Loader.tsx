import {Backdrop} from "@/shadcn/ui/backdrop.tsx";
import {Spinner} from "@/shadcn/ui/spinner.tsx";
import {noOp} from "@/utils.ts";

export function Loader({isLoading}: {isLoading: boolean}) {
  return (
    <Backdrop
      open={isLoading}
      onClose={noOp}
    >
      <Spinner className={"size-10"}/>
    </Backdrop>
  );
}