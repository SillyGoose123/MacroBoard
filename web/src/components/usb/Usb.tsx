import {useUsb} from "@/components/usb/useUsb.ts";
import {Button} from "@/shadcn/components/ui/button.tsx";

export const Usb = () => {
  const {error, isLoading, check, isAvailable} = useUsb();

  return (
      <>
        <Button onClick={check}>Check for macro board</Button>
        <p>
          LOADING: {isLoading.toString()}
        </p>

        <p>
          isAvailable: {isAvailable.toString()}
        </p>

        <p>
          error: {error == null ? "None" : error.toString()}
        </p>
      </>
  );
};