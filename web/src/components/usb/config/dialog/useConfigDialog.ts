import {useState} from "react";

export function useConfigDialog() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return {
    isOpen,
    setOpen
  }
}