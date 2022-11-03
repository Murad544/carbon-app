import { useQuery } from '@tanstack/react-query';
import { Token, tokenList } from 'services/tokens';
import { useCallback, useEffect, useState } from 'react';
import { ethToken } from 'services/web3/config';
import { TradeWidget } from './TradeWidget';
import { Page } from 'components/Page';

interface TradePageProps {
  from?: string;
  to?: string;
}

export const TradePage = ({ from, to }: TradePageProps) => {
  const query = useQuery(['tokens'], tokenList);
  const tokens = query.data;

  const ethOrFirst = useCallback(() => {
    const eth = tokens?.find((x) => x.address === ethToken);
    return eth ? eth : tokens ? tokens[0] : undefined;
  }, [tokens]);

  const [fromToken, setFromToken] = useState(ethOrFirst());
  const [toToken, setToToken] = useState<Token | undefined>();

  useEffect(() => {
    if (tokens) {
      if (from) {
        const fromToken = tokens.find((x) => x.address === from);
        if (fromToken) setFromToken(fromToken);
        else setFromToken(ethOrFirst());
      } else setFromToken(ethOrFirst());

      if (to) {
        const toToken = tokens.find((x) => x.address === to);
        if (toToken) setToToken(toToken);
        else setToToken(undefined);
      } else setToToken(undefined);
    }
  }, [from, to, tokens, ethOrFirst]);

  return (
    <Page title={'Trade'}>
      <div className="mx-auto max-w-[485px]">
        <TradeWidget from={fromToken} to={toToken} />
      </div>
    </Page>
  );
};
