import { FC } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuTrade } from 'components/core/menu/mainMenu/MainMenuTrade';

export const MainMenu: FC = () => {
  const { aboveBreakpoint } = useBreakpoints();

  return (
    <div className={`sticky top-0 z-40`}>
      <div className={'main-menu'}>
        <MainMenuLeft />
        {aboveBreakpoint('md') && <MainMenuTrade />}
        <MainMenuRight />
      </div>
    </div>
  );
};