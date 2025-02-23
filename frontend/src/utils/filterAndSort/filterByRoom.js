import { getRoomAlias } from "../mapRoomDesk";

export const filterByRoom = (data, roomFilter, roomsData) => {
    return data.filter((item) => {
      const roomMatch = roomFilter === "all" || getRoomAlias(item.room_id, roomsData) === roomFilter;
      return roomMatch;
    });
};