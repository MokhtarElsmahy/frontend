export class MediaCenterCategory {
  id: number;
  name_ar: string;
  name_en: string;
  type: string;
  media_items: MediaItem[];
}
export class MediaItem {
  id: number;
  title_ar: string;
  title_en: string;
  image_path: string;
  type: string;
}
