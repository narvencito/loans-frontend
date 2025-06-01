import { cn } from '@/lib/utils';
import React from 'react';

type MainAxis =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

type CrossAxis =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch';

interface RowAppProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number;
  mainAxisAlignment?: MainAxis;
  crossAxisAlignment?: CrossAxis;
}

const getJustify = (value?: MainAxis) => {
  switch (value) {
    case 'start': return 'justify-start';
    case 'center': return 'justify-center';
    case 'end': return 'justify-end';
    case 'between': return 'justify-between';
    case 'around': return 'justify-around';
    case 'evenly': return 'justify-evenly';
    default: return '';
  }
};

const getItems = (value?: CrossAxis) => {
  switch (value) {
    case 'start': return 'items-start';
    case 'center': return 'items-center';
    case 'end': return 'items-end';
    case 'stretch': return 'items-stretch';
    default: return '';
  }
};

const RowApp = ({
  children,
  gap = 2,
  mainAxisAlignment,
  crossAxisAlignment,
  className,
  ...props
}: RowAppProps) => {
  return (
    <div
      className={cn(
        'flex flex-row',
        `gap-${gap}`,
        getJustify(mainAxisAlignment),
        getItems(crossAxisAlignment),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default RowApp;
