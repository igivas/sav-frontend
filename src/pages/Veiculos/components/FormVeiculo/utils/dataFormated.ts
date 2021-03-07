type OptionsReferenciasPneus = { value: string; label: string };

export const formatReferenciasPneus = (
  referenciasPneus: OptionsReferenciasPneus[],
): Array<{ id_referencia_pneu: number }> => {
  return referenciasPneus.map<{ id_referencia_pneu: number }>(
    (referenciaPneu) => ({ id_referencia_pneu: Number(referenciaPneu.value) }),
  );
};
