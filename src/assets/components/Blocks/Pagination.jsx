import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types'
import styles from "../../../styles/layout/Layout.module.scss";

function Pagination({ table }) {
	const { t } = useTranslation();
	return (
		<>
			<div className={`${styles.PaginationContainer}`}>
				<div className={`${styles.PaginationTopWrapper}`}>
					<button
						className={`${styles.PaginationFirstPageButton}`}
						onClick={() => table.firstPage()}
						disabled={!table.getCanPreviousPage()}
					>
						{"<<"}
					</button>
					<button
						className={`${styles.PaginationPreviousPageButton}`}
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						{"<"}
					</button>
					<div className={`${styles.PaginationPageInfo}`}>
						<p className={`${styles.PaginationCurrentPage}`}>
							{t("Сторінка_з", { qty: table.getState().pagination.pageIndex + 1, total: table.getPageCount() })}
						</p>
						<p className={`${styles.PaginationGoToPage}`}>
							{t("Перейти до сторінки")}:
							<input
								type="number"
								defaultValue={table.getState().pagination.pageIndex + 1}
								onChange={(e) => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									table.setPageIndex(page);
								}}
								className={`${styles.PaginationGoToPageInput}`}
							/>
						</p>
					</div>
					<button
						className={`${styles.PaginationNextPageButton}`}
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						{">"}
					</button>
					<button
						className={`${styles.PaginationLastPageButton}`}
						onClick={() => table.lastPage()}
						disabled={!table.getCanNextPage()}
					>
						{">>"}
					</button>
				</div>
				<div className={`${styles.PaginationBottomWrapper}`}>
					<div className={`${styles.PaginationShowingRows}`}>
						{t("Показується_з_рядків", { qty: table.getRowModel().rows.length, total: table.getRowCount() })}
					</div>
					<div className={`${styles.PaginationShowingRowsSelect}`}>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
						>
							{[10, 20, 50].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{t("Показати")}&#160;{pageSize}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</>
	)
}

Pagination.propTypes = {
	table: PropTypes.object.isRequired,
}

export default Pagination
