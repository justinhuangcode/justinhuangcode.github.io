interface ActiveNavPathOptions {
  matchDescendants?: boolean;
  descendants?: string[];
}

export function normalizePathname(pathname: string): string {
  const barePath = pathname.split(/[?#]/, 1)[0] ?? pathname;
  const normalized = barePath.replace(/\/+$/, '');
  return normalized || '/';
}

function matchesTargetPath(
  currentPath: string,
  targetPath: string,
  matchDescendants: boolean,
): boolean {
  if (currentPath === targetPath) {
    return true;
  }

  return (
    matchDescendants &&
    targetPath !== '/' &&
    currentPath.startsWith(`${targetPath}/`)
  );
}

export function isActiveNavPath(
  currentPath: string,
  targetPath: string,
  options: ActiveNavPathOptions = {},
): boolean {
  const normalizedCurrent = normalizePathname(currentPath);
  const normalizedTarget = normalizePathname(targetPath);
  const matchDescendants = options.matchDescendants ?? true;

  if (matchesTargetPath(normalizedCurrent, normalizedTarget, matchDescendants)) {
    return true;
  }

  return (options.descendants ?? []).some((descendant) => {
    const descendantBase =
      normalizedTarget === '/'
        ? `/${descendant}`
        : `${normalizedTarget}/${descendant}`;

    return matchesTargetPath(normalizedCurrent, descendantBase, true);
  });
}
