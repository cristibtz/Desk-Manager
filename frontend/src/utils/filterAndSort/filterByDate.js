export const filterByDate = (data, startDateFilter) => {
    return data.filter((item) => {
      const startDateMatch = !startDateFilter || item.start_date >= startDateFilter;
      return startDateMatch;
    });
};