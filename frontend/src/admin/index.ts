export type BookManage = {
  id: number;
  name: string;
  status: string;
};

export function createBookManage(
  id: number,
  name: string,
  status: string
): BookManage {
  return { id, name, status };
}

export type BookState = {
  allBooks: BookManage[];
  filteredBooks: BookManage[] | null;
  keyword: string;
};
