export interface AdsModel {
  url: string;
  id: number;
  image: string;
  position_id: number;
  position: AdsPosition;
  view_order: string;
  page: string;
  status: {
    id: number;
    title: string;
  };
  created_at: string;
}

export interface AdsPosition {
  id: number;
  title: string;
  key: string;
}
