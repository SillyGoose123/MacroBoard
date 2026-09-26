import {useTranslation} from "@/components/TranslationProvider.tsx";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu.tsx";
import {ToolbarItem} from "@/components/toolbar/ToolbarItem.tsx";
import {Earth} from "lucide-react";

type LangMenuProps = {
  onLangChange: (lang: string) => void,
};

export function LangMenu({onLangChange}: LangMenuProps) {
  const {locales, lang} = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarItem
            icon={<Earth/>}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Language:</DropdownMenuLabel>
          {locales.map((locale: string) => <DropdownMenuCheckboxItem
            key={locale}
            checked={locale == lang}
            onCheckedChange={() => onLangChange(locale)}
          >
            {locale}
          </DropdownMenuCheckboxItem>)}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}