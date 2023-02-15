
export interface InitData {
  query_id: string,
  user: {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string
  },
  auth_date: string,
}

export interface Friend {
  id: number | string,
  name: string,
  avatar_url: string | null
}