import AuthNav from "@/components/auth/AuthNav";

import { IconButton } from "../icons";
import { TOPBAR_ICONS } from "./topbarIcons";

export default function TopBarActions() {
  return (
    <div className="flex items-center gap-4">
      <AuthNav />
      {TOPBAR_ICONS.map((icon) => (
        <IconButton
          key={icon.key}
          ariaLabel={icon.ariaLabel}
          iconSrc={icon.iconSrc}
        />
      ))}
    </div>
  );
}
