import React from "react";
import PropTypes from "prop-types";

const TableCell = ({ children, className = "" }) => {
  return <td className={`border border-gray-300 px-3 py-3 ${className}`}>{children}</td>;
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TableCell;