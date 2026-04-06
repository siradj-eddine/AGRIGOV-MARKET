import type { ApiOrderStatus } from "@/types/Orders";
import { STATUS_LABELS, STATUS_BADGE, STATUS_ICON } from "@/types/Orders";

interface Props {
  status: ApiOrderStatus;
  showIcon?: boolean;
}

export default function OrderStatusBadge({ status, showIcon = false }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs leading-5 font-semibold rounded-full ${STATUS_BADGE[status]}`}
    >
      {showIcon && (
        <span className="material-icons text-[12px] leading-none">{STATUS_ICON[status]}</span>
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}