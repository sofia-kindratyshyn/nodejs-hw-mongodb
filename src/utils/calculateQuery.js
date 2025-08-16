import createHttpError from 'http-errors';

export const calculateQueryInfo = async (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
  if (page <= totalPages) {
    return {
      page: Number(page),
      perPage: Number(perPage),
      totalPages,
      count,
      hasPreviousPage: page > 1,
      hasNextPage: page >= 1 && page < totalPages,
    };
  } else {
    throw createHttpError(404, 'There is no such page. Try to change query');
  }
};
