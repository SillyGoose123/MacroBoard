import {useCallback, useState} from "react";

//https://pid.codes test id
const filters = [
  {vendorId: 0x1209, productId: 0x0001}
]

export const useUsb = () => {
  const [device, setDevice] = useState<null | USBDevice>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initDevice = useCallback(async (newDevice: USBDevice) => {
    await newDevice.open();
    await newDevice.selectConfiguration(1);
    await newDevice.claimInterface(0);

    setDevice(newDevice);
    setIsLoading(false);
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

  return {
    check,
    isAvailable: device != null,
    isLoading,
    error
  }
}