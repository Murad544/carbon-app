import { useCallback, useEffect, useMemo } from 'react';
import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { BuySellBlock } from './BuySellBlock';
import { items } from './variants';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useStrategyEventData } from './useStrategyEventData';
import { carbonEvents } from 'services/events';
import useInitEffect from 'hooks/useInitEffect';
import { useWeb3 } from 'libs/web3';
import { getStatusTextByTxStatus } from '../utils';
import { useTranslation } from 'libs/translations';
import { useModal } from 'hooks/useModal';
import { StrategyCreateLocationGenerics } from 'components/strategies/create/types';
import { lsService } from 'services/localeStorage';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useNavigate } from 'libs/routing';

let didInit = false;

export const CreateStrategyOrders = ({
  base,
  quote,
  order0,
  order1,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
  strategyDirection,
  strategyType,
  isDuplicate,
  strategySettings,
  selectedStrategySettings,
  isProcessing,
  isAwaiting,
  isOrdersOverlap,
}: UseStrategyCreateReturn) => {
  const { t } = useTranslation();
  const { user } = useWeb3();
  const { openModal } = useModal();
  const navigate = useNavigate<StrategyCreateLocationGenerics>();
  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });

  useInitEffect(() => {
    selectedStrategySettings?.search.strategyType === 'disposable' &&
      carbonEvents.strategy.strategyDirectionChange({
        baseToken: base,
        quoteToken: quote,
        strategySettings: selectedStrategySettings.search.strategySettings,
        strategyDirection: strategyDirection,
        strategyType: selectedStrategySettings.search.strategyType,
      });
  }, [strategyDirection]);

  const handleExpertMode = useCallback(() => {
    if (lsService.getItem('hasSeenCreateStratExpertMode')) {
      return;
    }

    if (isDuplicate && (order0.isRange || order1.isRange)) {
      return openModal('createStratExpertMode', {
        onClose: () => {
          order0.setIsRange(false);
          order1.setIsRange(false);
        },
      });
    }

    if (strategySettings === 'range' || strategySettings === 'custom') {
      return openModal('createStratExpertMode', {
        onClose: () =>
          navigate({
            search: (prev: any) => ({ ...prev, strategySettings: 'limit' }),
            replace: true,
          }),
      });
    }
  }, [isDuplicate, navigate, openModal, order0, order1, strategySettings]);

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      void handleExpertMode();
    }
  }, [handleExpertMode]);

  const onCreateStrategy = () => {
    carbonEvents.strategy.strategyCreateClick(strategyEventData);
    createStrategy();
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing, t);
  }, [isAwaiting, isProcessing, t]);

  return (
    <>
      <m.div
        variants={items}
        key={'createStrategyBuyTokens'}
        className={'rounded-10 bg-silver p-20 ps-30'}
      >
        <div className={'flex space-s-10'}>
          <TokensOverlap className="h-40 w-40" tokens={[base!, quote!]} />
          <div>
            {
              <div className="flex space-s-6">
                <span>{base?.symbol}</span>
                <div className="text-secondary !text-16">/</div>
                <span>{quote?.symbol}</span>
              </div>
            }
            <div className="text-secondary capitalize">
              {strategyType === 'recurring'
                ? t('pages.strategyCreate.step2.section1.titles.title1')
                : t('pages.strategyCreate.step2.section1.titles.title2')}
            </div>
          </div>
        </div>
        <div
          className={
            'mt-10 flex items-center text-12 font-weight-400 text-white/60'
          }
        >
          <IconWarning className={'w-14 flex-shrink-0 -ms-6 me-10'} />
          {t('pages.strategyCreate.step2.section1.contents.content1')}
        </div>
      </m.div>

      {(strategyDirection === 'buy' || !strategyDirection) && (
        <m.div variants={items} key={'createStrategyBuyOrder'}>
          <BuySellBlock
            base={base!}
            quote={quote!}
            order={order0}
            buy
            tokenBalanceQuery={token1BalanceQuery}
            isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
            strategyType={strategyType}
            isOrdersOverlap={isOrdersOverlap}
          />
        </m.div>
      )}
      {(strategyDirection === 'sell' || !strategyDirection) && (
        <m.div variants={items} key={'createStrategySellOrder'}>
          <BuySellBlock
            base={base!}
            quote={quote!}
            order={order1}
            tokenBalanceQuery={token0BalanceQuery}
            isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
            strategyType={strategyType}
            isOrdersOverlap={isOrdersOverlap}
          />
        </m.div>
      )}
      <m.div variants={items} key={'createStrategyCTA'}>
        <Button
          variant={'success'}
          size={'lg'}
          fullWidth
          onClick={onCreateStrategy}
          disabled={isCTAdisabled}
          loading={isProcessing || isAwaiting}
          loadingChildren={loadingChildren}
        >
          {user
            ? t('pages.strategyCreate.step2.actionButton')
            : t('common.actionButtons.actionButton1')}
        </Button>
      </m.div>
    </>
  );
};
