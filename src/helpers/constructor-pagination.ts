export type ConstructorPaginationType = { pageNumber: number; pageSize: number };
export type ArgPaginationType = {
  pageNumber: string | undefined;
  pageSize: string | undefined;
};
export const constructorPagination = ({ pageNumber, pageSize }: ArgPaginationType): ConstructorPaginationType => {
  let result: ConstructorPaginationType = {
    pageNumber: 1,
    pageSize: 10,
  };
  if (pageNumber) result.pageNumber = +pageNumber;
  if (pageSize) result.pageSize = +pageSize;
  return result;
};
