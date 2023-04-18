export interface SubscribedPackage {
  detail: {
    id: number;
    duration: number;
  };
  package: {
    id: number;
    title: string;
  };
  id: number;
  title: string;
  quantity: number;
  remaining: number;
  created_at: string;
  status: {
    id: number;
    title: string;
  };
}
