export const getDeskNumber = (deskId, desksData) => {
    if(desksData === null || desksData === undefined) {
        return "Unknown";
    }
    const desk = desksData.find(d => d.id === deskId);
    return desk ? desk.desk_number : "Unknown";
};

export const getRoomAlias = (roomId, roomsData) => {
    if(roomsData === null || roomsData === undefined) {
        return "Unknown";
    }
    const room = roomsData.find(r => r.id === roomId);
    return room ? room.room_alias : "Unknown";
};
