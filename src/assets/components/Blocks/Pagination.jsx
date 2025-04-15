import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types'

function Pagination({ table }) {
  const { t } = useTranslation();
	return (
		<>
			<div className="flex items-center gap-2">
            <button
              className="border rounded p-2"
              onClick={() => table.firstPage()}
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
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              {t("Сторінка_з", { qty: table.getState().pagination.pageIndex + 1, total: table.getPageCount()})}
            </span>
            <span className="flex items-center gap-1">
              | {t("Перейти до сторінки")}:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
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
              {[2, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {t("Показати", { pageSize })}
                </option>
              ))}
            </select>
          </div>
          <div>
            {t("Показується_з_рядків", { qty: table.getRowModel().rows.length, total: table.getRowCount() })}
          </div>
		</>
	)
}

Pagination.propTypes = {
	table: PropTypes.object.isRequired,
}

export default Pagination
