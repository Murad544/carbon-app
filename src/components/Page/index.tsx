import { FC, ReactNode } from 'react';

export const Page: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  return (
    <div
      className={'mx-auto mt-50 max-w-[1280px] px-10 pb-30 md:px-20 xl:px-50'}
    >
      {title && <h1 className={'mb-30'}>{title}</h1>}
      {children}
    </div>
  );
};
