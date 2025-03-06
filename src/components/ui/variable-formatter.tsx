import { getVariableDetails } from "@/lib/helpers";
import { GasLawType } from "@/lib/types";

export const formatVariableName = (lawType: GasLawType, variableId: string) => {
  const { symbol, fullName } = getVariableDetails(lawType, variableId);
  return (
    <>
      <strong>{symbol}</strong> <span>({fullName})</span>
    </>
  );
};

export const formatVariableSymbol = (
  lawType: GasLawType,
  variableId: string
) => {
  const { symbol } = getVariableDetails(lawType, variableId);
  return <strong>{symbol}</strong>;
};
