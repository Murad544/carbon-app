import { FC, useEffect, useRef } from 'react';
import { useWeb3 } from 'libs/web3';
import { Outlet, PathNames, useLocation } from 'libs/routing';
import { ErrorUnsupportedNetwork } from 'components/core/error/ErrorUnsupportedNetwork';
import { ErrorNetworkConnection } from 'components/core/error/ErrorNetworkConnection';
import { useTokens } from 'hooks/useTokens';
import { ErrorTokenList } from 'components/core/error/ErrorTokenList';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { ErrorSDKStartSync } from 'components/core/error/ErrorSDKStartSync';
import { carbonEvents } from 'services/events';
import { ErrorUserBlocked } from 'components/core/error/ErrorUserBlocked';

export const MainContent: FC = () => {
  const web3 = useWeb3();
  const location = useLocation();
  const prevPathnameRef = useRef('');
  const tokens = useTokens();
  const sdk = useCarbonInit();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
    });
  }, [location.current]);

  useEffect(() => {
    if (prevPathnameRef.current !== location.current.pathname) {
      carbonEvents.general.changePage({ referrer: prevPathnameRef.current });

      prevPathnameRef.current = location.current.pathname;
    }
  }, [location, location.current.pathname]);

  if (
    location.current.pathname === PathNames.debug ||
    location.current.pathname === PathNames.terms ||
    location.current.pathname === PathNames.privacy
  ) {
    return <Outlet />;
  }

  if (!web3.isSupportedNetwork) {
    return <ErrorUnsupportedNetwork />;
  }

  if (web3.networkError) {
    return <ErrorNetworkConnection />;
  }

  if (sdk.isError) {
    return <ErrorSDKStartSync />;
  }

  if (tokens.isError) {
    return <ErrorTokenList />;
  }

  if (web3.isUserBlocked) {
    return <ErrorUserBlocked />;
  }

  return <Outlet />;
};
