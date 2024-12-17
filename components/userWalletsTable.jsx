import React, { useEffect } from "react";

import { IconClosed } from "@/components/Icon";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  ExpandedState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      type="text"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default function UserWalletsTable() {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <>ID</>,
      },
      {
        accessorKey: "ethAddress",
        header: () => "ETH Address",
      },
      {
        accessorKey: "kdaWallet",
        header: () => <span>KDA Wallet</span>,
      },
      {
        accessorKey: "ltcWallet",
        header: () => <span>LTC Wallet</span>,
      },
      {
        accessorKey: "ckbWallet",
        header: () => <span>CKB Wallet</span>,
      },
    ],
    []
  );

  const [data, setData] = React.useState();

  const [expanded, setExpanded] = React.useState();

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      expanded,
      globalFilter,
    },

    paginateExpandedRows: false,
    autoResetExpanded: false,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    debugTable: true,
  });

  const getUserData = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {" "}
      {data ? (
        <>
          {" "}
          <div className="p-2">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
            />
            <div className="h-2 px-2 rounded-md" />
            <table className=" border-2 border-solid  ">
              <thead className="border-2 p-2 rounded-lg">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          className="border-2 border-r-2 px-10"
                        >
                          {header.isPlaceholder ? null : (
                            <div>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="border-b-2">
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="border-2 border-r-2 px-10 justify-between text-center"
                          >
                            {cell.column.columnDef.accessorKey ==
                            "ckbWallet" ? (
                              <>
                                {flexRender(
                                  String(cell.getValue()).slice(0, -85) +
                                    "....." +
                                    String(cell.getValue()).slice(90),
                                  cell.getContext()
                                )}
                              </>
                            ) : null}
                            {cell.column.columnDef.accessorKey ==
                            "kdaWallet" ? (
                              <>
                                {flexRender(
                                  String(cell.getValue()).slice(0, -55) +
                                    "....." +
                                    String(cell.getValue()).slice(60),
                                  cell.getContext()
                                )}
                              </>
                            ) : null}
                            {cell.column.columnDef.accessorKey ==
                            "ltcWallet" ? (
                              <>
                                {flexRender(
                                  String(cell.getValue()).slice(0, -25) +
                                    "....." +
                                    String(cell.getValue()).slice(30),
                                  cell.getContext()
                                )}
                              </>
                            ) : null}
                            {cell.column.columnDef.accessorKey == "id" ? (
                              <>
                                {flexRender(cell.getValue(), cell.getContext())}
                              </>
                            ) : null}
                            {cell.column.columnDef.accessorKey ==
                            "ethAddress" ? (
                              <>
                                {flexRender(
                                  String(cell.getValue()).slice(0, -25) +
                                    "....." +
                                    String(cell.getValue()).slice(30),
                                  cell.getContext()
                                )}
                              </>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>{" "}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
