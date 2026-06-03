export interface Chantier {
  id: string;
  name: string;
  address: string | null;
  client_name: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}
