import { Icon, type IconName } from "@/components/ui/Icon";

interface Props {
  icon?: IconName;
  title?: string;
  sub?: string;
}

export function EmptyState({
  icon = "stotra",
  title = "Nothing here yet",
  sub = "Articles will appear as they are published.",
}: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-border-mid bg-cream-2 px-8 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-muted">
        <Icon name={icon} size={20} />
      </span>
      <div className="text-[15px] font-medium text-ink-body">{title}</div>
      <div className="text-[13px] text-ink-muted">{sub}</div>
    </div>
  );
}
