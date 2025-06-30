import React, { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TableCell } from "@/components/ui/table";
import { InfoIcon } from "lucide-react"; // O usa un ícono de tu preferencia

interface Props {
  text: string;
}

const TruncatedWithTooltip = ({ text }: Props) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setIsTruncated(true);
    }
  }, [text]);

  return (
    <TableCell className="max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis">
      <div className="flex items-center gap-1">
        <span ref={textRef} className="truncate">
          {text}
        </span>
        {isTruncated && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-muted-foreground cursor-pointer text-yellow-400 flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                {text}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </TableCell>
  );
};

export default TruncatedWithTooltip;