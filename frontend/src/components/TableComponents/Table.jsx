import React from "react";
import PropTypes from "prop-types";

const TableHeader = ({ columns }) => (
  <thead className="bg-gray-200">
    <tr>
      {columns.map((column) => (
        <th key={column} className="border border-gray-300 px-3 py-3 text-black">
          {column}
        </th>
      ))}
    </tr>
  </thead>
);

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const TableRow = ({ item, renderRow, index }) => (
  <tr className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-300`}>
    {renderRow(item)}
  </tr>
);

TableRow.propTypes = {
  item: PropTypes.object.isRequired,
  renderRow: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

const TableBody = ({ data, renderRow }) => (
  <tbody>
    {data.map((item, index) => (
      <TableRow key={index} item={item} renderRow={renderRow} index={index} />
    ))}
  </tbody>
);

TableBody.propTypes = {
  data: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
};

const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="px-5 overflow-x-auto">
      {data.length > 0 ? (
        <table className="min-w-full border-collapse w-full my-5 text-lg text-left">
          <TableHeader columns={columns} />
          <TableBody data={data} renderRow={renderRow} />
        </table>
      ) : (
        <p className="text-center text-white">No data found.</p>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
};

export default Table;