import type { ReactNode } from "react";

import TopBarActions from "./topBarActions";
import TopBarTitle from "./topBarTitle";

type TopBarProps = {
  title?: ReactNode;
};

export default function TopBar({ title = "المستشار" }: TopBarProps) {
  return (
    <header>
      <div dir="ltr" className="flex h-14 items-center justify-between">
        <TopBarActions />
        <TopBarTitle>{title}</TopBarTitle>
      </div>
    </header>
  );
}

