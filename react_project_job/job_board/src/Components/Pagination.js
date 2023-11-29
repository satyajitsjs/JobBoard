import React from "react";

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  previousPageUrl,
  nextPageUrl,
}) => {
  const pages = [...Array(pageCount).keys()].map((pageNum) => pageNum + 1);

  return (
    <div className="flex space-x-2">
      {previousPageUrl && (
        <button
          className="px-3 py-2 border rounded-md bg-white text-black"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-2 border rounded-md ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {nextPageUrl && (
        <button
          className="px-3 py-2 border rounded-md bg-white text-black"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
