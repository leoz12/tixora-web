import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

interface NumberedPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
}

export default function NumberedPagination({
  page,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
}: NumberedPaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <ChevronLeftIcon />
            {prevLabel}
          </button>
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i + 1}>
            <button
              onClick={() => onPageChange(i + 1)}
              aria-current={page === i + 1 ? "page" : undefined}
              className={buttonVariants({
                variant: page === i + 1 ? "outline" : "ghost",
                size: "icon",
                className: "rounded-full",
              })}
            >
              {i + 1}
            </button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            {nextLabel}
            <ChevronRightIcon />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
