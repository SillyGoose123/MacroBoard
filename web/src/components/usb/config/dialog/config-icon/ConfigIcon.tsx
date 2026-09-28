import {
  DiscAlbum,
  Microchip,
  Square,
  Disc,
  SquareSquare
} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/ui/tooltip.tsx";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import styles from "./ConfigIcon.module.css";

const size = 150;
const strokeWidth = 0.5;
const defaultProps = {size: size, strokeWidth: strokeWidth};

const ConfigIcons = {
  MCU: <Microchip {...defaultProps} style={{rotate: "-90deg"}}/>,
  LED: <SquareSquare size={size / 3} strokeWidth={0.75}/>,
  Summer: <Disc {...defaultProps}/>,
  Knob: <DiscAlbum {...defaultProps} />,
  Switch: <Square {...defaultProps} />
};

export type ConfigIconTypes = keyof typeof ConfigIcons;

type ConfigIconProps = {
  type: ConfigIconTypes,
  onClick?: () => void;
  num?: number
};

export function ConfigIcon({type, onClick, num}: ConfigIconProps) {
  const {t} = useTranslation();
  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div onClick={onClick} className={styles.iconOverlay}>
            {num && <span>{num}</span>}
            {ConfigIcons[type]}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {t(type)}
        </TooltipContent>
      </Tooltip>
  );
}