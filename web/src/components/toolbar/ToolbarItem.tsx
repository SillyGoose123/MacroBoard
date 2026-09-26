import type {ReactNode} from "react";
import {Button} from "@/shadcn/ui/button.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/ui/tooltip";

type ToolbarItemProps = {
  icon: ReactNode;
  tooltipContent?: string;
  onClick?: () => void;
};

export function ToolbarItem({icon, tooltipContent, onClick}: ToolbarItemProps) {
  const button = <Button
    onClick={onClick}
    size="icon"
    aria-label="Submit"
    variant="ghost"
  >
    {icon}
  </Button>;

  if (!tooltipContent) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {button}
      </TooltipTrigger>
      <TooltipContent>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}