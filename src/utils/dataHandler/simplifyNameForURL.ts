export function simplifyNameForURL(name: string) {
  // Normaliza a string para remover acentos
  const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Substitui caracteres não alfanuméricos por hifens
  const simplified = normalized.replace(/[^a-zA-Z0-9]/g, '-');

  // Remove hifens extras
  const cleaned = simplified.replace(/-+/g, '-').replace(/^-|-$/g, '');

  return cleaned;
}
