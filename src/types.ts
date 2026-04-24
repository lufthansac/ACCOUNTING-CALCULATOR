/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  items: JournalItem[];
}

export interface JournalItem {
  id: string;
  accountId: string;
  accountName: string;
  ref: string;
  debit: number;
  credit: number;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
}

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: '101', code: '101', name: 'Kas', category: 'Asset' },
  { id: '102', code: '102', name: 'Piutang Usaha', category: 'Asset' },
  { id: '103', code: '103', name: 'Perlengkapan', category: 'Asset' },
  { id: '121', code: '121', name: 'Peralatan', category: 'Asset' },
  { id: '201', code: '201', name: 'Utang Usaha', category: 'Liability' },
  { id: '301', code: '301', name: 'Modal Pemilik', category: 'Equity' },
  { id: '302', code: '302', name: 'Prive', category: 'Equity' },
  { id: '401', code: '401', name: 'Pendapatan Jasa', category: 'Revenue' },
  { id: '501', code: '501', name: 'Beban Gaji', category: 'Expense' },
  { id: '502', code: '502', name: 'Beban Sewa', category: 'Expense' },
  { id: '503', code: '503', name: 'Beban Listrik & Air', category: 'Expense' },
];
