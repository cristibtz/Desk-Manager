export const sortByDate = (data, sortOrder, dateKey) => {
    return data.sort((a, b) => {
      const dateA = new Date(a[dateKey]);
      const dateB = new Date(b[dateKey]);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };