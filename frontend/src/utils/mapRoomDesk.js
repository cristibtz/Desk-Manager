export const getDeskNumber = (deskId, desksData) => {
    const desk = desksData.find(d => d.id === deskId);
    return desk ? desk.desk_number : "Unknown";
};

export const getRoomAlias = (roomId, roomsData) => {
    const room = roomsData.find(r => r.id === roomId);
    return room ? room.room_alias : "Unknown";
};
