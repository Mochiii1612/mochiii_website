import { INSTALL_COMMAND, MARKETPLACE_URL } from './site.config';

/** The two ways to install, behind "Install" in the top navigation and in the phone menu. */
export const INSTALL_ITEMS = [
  { key: 'vscode', label: 'VS Code', detail: 'From the VS Code Marketplace', href: MARKETPLACE_URL },
  { key: 'npm', label: 'npm', detail: `Terminal app: ${INSTALL_COMMAND}`, to: '/#install' },
] as const;
