import styles from "@/components/usb/ConfigEditor/ConfigDialog/ConfigType/ConfigType.module.css";
import {
  DiscAlbum,
  Microchip,
  Square,
  Disc,
  SquareSquare
} from "lucide-react";

const size = 150;
const strokeWidth = 0.5;
const defaultProps = {size: size, strokeWidth: strokeWidth, className: styles.icons};

export const ConfigType = {
  MCU: <Microchip {...defaultProps} style={{rotate: "-90deg"}}/>,
  LED: <SquareSquare size={size / 3} strokeWidth={0.75} className={styles.led}/>,
  Summer: <Disc {...defaultProps}/>,
  Knob: <DiscAlbum {...defaultProps} />,
  Switch: <Square {...defaultProps} />
};

export type ConfigType = typeof ConfigType[keyof typeof ConfigType];