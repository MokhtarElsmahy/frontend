export class DocumentStats {
  latest: Document[];
  most_viewed: Document[];
}
export class Document {
  id: number;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
}
