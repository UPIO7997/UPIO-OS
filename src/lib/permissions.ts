export const ROLE_PERMISSIONS: Record<string, string[]> = {
  employee: ['/influencers', '/theme-influencers', '/brands', '/campaigns', '/tasks', '/ai'],
  finance: ['/finance', '/', '/reports', '/ai', '/tasks'],
  research: ['/employees', '/tasks', '/ai'],
  founder: ['*'], // '*' means all access
}

export function hasAccess(role: string, path: string): boolean {
  if (role === 'founder') return true;
  
  const allowedPaths = ROLE_PERMISSIONS[role] || [];
  if (allowedPaths.includes('*')) return true;
  
  return allowedPaths.includes(path);
}
