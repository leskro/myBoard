// ISO Paper Sizes in pixels at 96 DPI
// 1 inch = 96 px
// A4 = 210mm x 297mm = 8.27in x 11.7in = 794px x 1123px

export const PAPER_SIZES = {
  A4: { width: 794, height: 1123, label: 'A4' },
  A3: { width: 1123, height: 1587, label: 'A3' },
  A2: { width: 1587, height: 2245, label: 'A2' },
  A1: { width: 2245, height: 3177, label: 'A1' },
  A0: { width: 3177, height: 4490, label: 'A0' },
} as const;

export type PaperSizeKey = keyof typeof PAPER_SIZES;

export const DEFAULT_PAPER_SIZE: PaperSizeKey = 'A3';
