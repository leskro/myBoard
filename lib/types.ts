export type CanvasItemType = 'postit' | 'sticker' | 'text';

export interface CanvasItem {
  id: string;
  type: CanvasItemType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  content: string;
  rotation: number;
}
