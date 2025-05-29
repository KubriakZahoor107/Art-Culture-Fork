import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProfilePageContainer from "@components/Blocks/ProfilePageContainer";
import API from "../../../utils/api.js";
import Loading from "@components/Blocks/Loading.jsx";
import LoadingError from "@components/Blocks/LoadingError.jsx";
import Pagination from "@components/Blocks/Pagination.jsx";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { getFormattedDate, getFormattedTime } from "../../../utils/helper.js";
import "../../../styles/components/Blocks/AdminTables.scss";

const columnHelper = createColumnHelper();

const AdminUserList = () => {
	const { t } = useTranslation();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const columns = [
		columnHelper.accessor("id", {
			cell: (info) => <a href={`/admin/users/${info.row.getValue("id")}`}>{info.renderValue()}</a>,
			header: () => <span>{t("Код")}</span>,
		}),
		columnHelper.accessor("title", {
			cell: (info) => <a href={`/admin/users/${info.row.getValue("id")}`}>{info.renderValue()}</a>,
			header: () => <span>{t("П.І.Б")}</span>,
		}),
		columnHelper.accessor("email", {
			cell: (info) => <a href={`/admin/users/${info.row.getValue("id")}`}>{info.renderValue()}</a>,
			header: () => <span>{t("Email")}</span>,
		}),
		columnHelper.accessor("role", {
			cell: (info) => <a href={`/admin/users/${info.row.getValue("id")}`}>{info.renderValue()}</a>,
			header: () => <span>{t("Роль")}</span>,
		}),
		columnHelper.accessor("country", {
			header: () => <span>{t("Країна")}</span>,
			cell: (info) => <a href={`/admin/users/${info.row.getValue("id")}`}>{info.renderValue()}</a>,
		}),
		columnHelper.accessor("createdAt", {
			header: () => <span>{t("Дата")}</span>,
			cell: (info) => <>{getFormattedDate(info.getValue())} {getFormattedTime(info.getValue())}</>,
		}),
		// columnHelper.accessor("status", {
		// 	header: () => <span>{t("Статус")}</span>,
		// 	cell: (info) =>
		// 		<a href={`/admin/users/${info.row.getValue("id")}`}>{t("Статус поста " + info.getValue())}</a>,
		// }),
	];

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await API.get("/admin/users");
				setData(Array.isArray(response.data?.data) ? response.data.data : []);
			} catch (err) {
				setError(t("Помилка завантаження"));
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<ProfilePageContainer>
			<h2>{t("Список користувачів")}</h2>
			{loading ? (
				<Loading />
			) : error ? (
				<LoadingError />
			) : data.length === 0 ? (
				<p>{t("Немає користувачів")}</p>
			) : (
				<>
					<table className="admin-table">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th key={header.id}>
											{header.isPlaceholder ? null : (
												<div className="sortable-header" onClick={header.column.getToggleSortingHandler()}>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? " 🔼" : " 🔽") : null}
												</div>
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
					<Pagination table={table} />
				</>
			)}
		</ProfilePageContainer>
	);
};

export default AdminUserList;
