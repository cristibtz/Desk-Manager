export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const isoString = date.toISOString();

    const year = isoString.slice(0, 4);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = isoString.slice(8, 10);
    const hours = isoString.slice(11, 13);
    const minutes = isoString.slice(14, 16);

    return `${month} ${day}, ${year} ${hours}:${minutes}`;
};