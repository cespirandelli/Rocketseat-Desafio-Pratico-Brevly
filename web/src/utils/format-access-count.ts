export function formatAccessCount(accessCount: number) {
  const formatted = accessCount.toLocaleString('pt-BR')

  return accessCount === 1 ? `${formatted} acesso` : `${formatted} acessos`
}
