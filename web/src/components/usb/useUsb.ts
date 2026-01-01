import {useCallback, useEffect, useState} from "react";

//https://pid.codes test id
const filters = [
  {vendorId: 0x1209, productId: 0x0001}
]

//TODO: REFACTOR
export const useUsb = () => {
  const [device, setDevice] = useState<null | USBDevice>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const readConfig = useCallback(async () => {
    setIsLoading(true);

    if (!device) {
      setError("Can't read with no device");
      setIsLoading(false);
      return;
    }



    setIsLoading(false);
  }, [device])

  const initDevice = useCallback(async (device: USBDevice) => {
    await device.open();
    if (device.configuration === null) await device.selectConfiguration(1);
    await device.claimInterface(1);
    setDevice(device);
    await readConfig()
  }, []);

  const check = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (device != null) {
      await device.close()
      setDevice(null);
    }

    if (navigator.usb == undefined) {
      setError("Browser incompatible")
      setIsLoading(false);
      return;
    }

    navigator.usb.requestDevice({filters}).then(initDevice).catch((err: Error) => {
      console.error(err);
      setError(err.message);
      setDevice(null);
      setIsLoading(false);
    });
  }, [device, initDevice]);

  const close = useCallback(async () => {
    if(device == null) return;
    setIsLoading(true);
    await device.close();
    setDevice(null);
    setError(null);
    setIsLoading(false);
  }, [device])

  useEffect(() => {
    window.addEventListener("beforeunload", async () => {
      await close();
    })
  }, []);

  return {
    check,
    isAvailable: device != null,
    isLoading,
    error
  }
}