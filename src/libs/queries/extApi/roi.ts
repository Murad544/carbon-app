import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';

export const useGetRoi = () => {
  return useQuery(QueryKey.roi(), async () => carbonApi.getRoi(), {
    enabled: !!import.meta.env.VITE_CARBON_API_KEY,
    refetchInterval: FIVE_MIN_IN_MS,
    staleTime: FIVE_MIN_IN_MS,
  });
};
