import type {Config} from "@/../bindings/Config"
import styles from "@/components/usb/config-editor/ConfigEditor.module.css";
import {
  DiscAlbum as Knob,
  Microchip as MCU,
  Square,
  Disc as Summer,
  SquareSquare
} from "lucide-react";

const size = 150;
const strokeWidth = 0.5;

const LED = () => <SquareSquare size={size / 3} strokeWidth={0.75} className={styles.led}/>;

const defaultProps = {size: size, strokeWidth: strokeWidth, className: styles.icons};
const Switch = () => <Square className={styles.icons} {...defaultProps}/>;

type ConfigEditorProps = {
  config: Config;
}

export function ConfigEditor({config}: ConfigEditorProps) {
  return <div className={styles.configEditor}>
    <div className={styles.row}>
      <MCU {...defaultProps} className={styles.mcu}/>
      <Knob {...defaultProps}/>
      <Switch/>
      <Switch/>
      <Summer {...defaultProps}/>
    </div>

    <div className={styles.row}>
      <LED/>
      <Switch/>
      <Switch/>
      <Switch/>
      <Switch/>
      <LED/>
    </div>
    <div className={styles.row}>
      <LED/>
      <span>Created by Leo & SillyGoose</span>
      <LED/>
      <span>MacroBoard</span>
      <LED/>
    </div>
  </div>;
}

