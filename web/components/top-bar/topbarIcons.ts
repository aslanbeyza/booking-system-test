export type TopBarIcon = {
  key: "lamp" | "message" | "bell";
  ariaLabel: string;
  iconSrc: string;
};

export const TOPBAR_ICONS: TopBarIcon[] = [
  { key: "lamp", ariaLabel: "مصباح", iconSrc: "/28-lamp%201.svg" },
  { key: "message", ariaLabel: "الرسائل", iconSrc: "/14-message%201.svg" },
  { key: "bell", ariaLabel: "الإشعارات", iconSrc: "/16-bell%201.svg" },
];

