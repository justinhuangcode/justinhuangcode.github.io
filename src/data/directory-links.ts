import type { Locale } from '@/i18n';

export type LocalizedDirectoryValue = string | Partial<Record<Locale, string>>;

export interface DirectorySourceLink {
  spec: {
    displayName: LocalizedDirectoryValue;
    description: LocalizedDirectoryValue;
    url: string;
    logo?: string;
  };
  annotations?: {
    show_link_anonymous?: 'true' | 'false';
    to_post_radio?: 'true' | 'false';
  };
}

export interface DirectorySourceGroup {
  spec: {
    displayName: LocalizedDirectoryValue;
  };
  annotations: {
    icon: string;
    show_in_directory?: 'true' | 'false';
    show_group_anonymous?: 'true' | 'false';
  };
  links: DirectorySourceLink[];
}

// Site-owned directory data. Keep this file separate from upstream theme/runtime
// upgrades so new directory links can be curated intentionally.
export const directoryGroupsSource: DirectorySourceGroup[] = [];
