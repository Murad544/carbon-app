import {
  GetUserApprovalProps,
  useGetUserApproval,
} from 'libs/queries/chain/approval';
import { useMemo } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';
import { NULL_APPROVAL_CONTRACTS } from 'utils/approval';

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
};

export type ApprovalTokenResult = ApprovalToken & {
  allowance: string;
  approvalRequired: boolean;
  nullApprovalRequired: boolean;
  isNullApprovalToken: boolean;
};

export const useApproval = (data: ApprovalToken[]) => {
  const approvalQuery = useGetUserApproval(data);

  const result = useMemo(() => {
    return approvalQuery.map((q, i) => {
      const isNullApprovalToken = NULL_APPROVAL_CONTRACTS.includes(
        data[i].address.toLowerCase()
      );
      const newData: ApprovalTokenResult | undefined = q.data && {
        ...data[i],
        allowance: q.data.toString(),
        approvalRequired: q.data.lt(
          sanitizeNumberInput(data[i].amount, data[i].decimals)
        ),
        isNullApprovalToken,
        nullApprovalRequired: isNullApprovalToken && q.data.gt(0),
      };
      return {
        ...q,
        data: newData,
      };
    });
  }, [approvalQuery, data]);

  const approvalRequired = useMemo(
    () => result.some((x) => x.data?.approvalRequired),
    [result]
  );

  const isLoading = useMemo(() => result.some((x) => x.isLoading), [result]);
  const isError = useMemo(() => result.some((x) => x.isError), [result]);
  const error = useMemo(() => result.find((x) => x.isError)?.error, [result]);

  return {
    approvalQuery: result,
    approvalRequired,
    isLoading,
    isError,
    error,
    tokens: data,
  };
};
