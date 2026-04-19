interface ActiveNavPathOptions {
  descendants?: string[];
}

export function normalizePathname(pathname: string): string {
  const barePath = pathname.split(/[?#]/, 1)[0] ?? pathname;
  const normalized = barePath.replace(/\/+$/, '');
  return normalized || '/';
}

function matchesExactOrDescendant(currentPath: string, targetPath: string): boolean {
  return (
    currentPath === targetPath ||
    (targetPath !== '/' && currentPath.startsWith(`${targetPath}/`))
  );
}

export function isActiveNavPath(
  currentPath: string,
  targetPath: string,
  options: ActiveNavPathOptions = {},
): boolean {
  const normalizedCurrent = normalizePathname(currentPath);
  const normalizedTarget = normalizePathname(targetPath);

  if (matchesExactOrDescendant(normalizedCurrent, normalizedTarget)) {
    return true;
  }

  return (options.descendants ?? []).some((descendant) => {
    const descendantBase =
      normalizedTarget === '/'
        ? `/${descendant}`
        : `${normalizedTarget}/${descendant}`;

    return matchesExactOrDescendant(normalizedCurrent, descendantBase);
  });
}
