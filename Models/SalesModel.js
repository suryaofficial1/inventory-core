import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const salesModel = {};
const conditionEnum = filterService.condition;

salesModel.upsertSales = async (body) => {
    const connection = await db.getConnection();
    const updateSql = `UPDATE sales SET  invoiceNo= ?, p_desc = ?, qty = ?, s_price = ?, unit = ?, status = ?, s_date = ? WHERE id = ? and productionId = ?`;
    const insertSql = `INSERT INTO sales (c_id, productionId, p_id, invoiceNo, p_desc, qty, s_price, unit, status, s_date, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.invoiceNo,
                body.pDesc,
                body.qty,
                body.salesPrice,
                body.unit,
                body.status,
                body.salesDate,
                body.id,
                body.productionId,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.customer,
                body.productionId,
                body.product,
                body.invoiceNo,
                body.pDesc,
                body.qty,
                body.salesPrice,
                body.unit,
                body.status,
                body.salesDate,
            ]);
            const salesId = insertResult.insertId;
            const salesName = 'Supra-ind-' + salesId;
            await connection.query(`UPDATE sales SET salesName = ? WHERE id = ?`, [salesName, salesId]);
            return { insertId: salesId };
        }
    } finally {
        connection.release();
    }
};

const sales_config = [
    { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
];

salesModel.getSales = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, sales_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM sales s
                            LEFT JOIN production prd ON prd.id = s.productionId
                            left join product p on s.p_id = p.id
                            LEFT JOIN customer c ON c.id = s.c_id ${whereCondition} ${filter}`;
        const listSql = `SELECT s.id, s.productionId, prd.batchNo ,s.salesName, s.invoiceNo, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                              JSON_OBJECT('id', p.id, 'name', p.name) AS product,
							  s.p_desc AS pDesc, s.qty, s.s_price AS salesPrice, s.unit, s.status,
                              s.s_date AS salesDate
                            FROM sales s
                            LEFT JOIN production prd ON prd.id = s.productionId
                            left join product p on s.p_id = p.id
                            LEFT JOIN customer c ON c.id = s.c_id
        ${whereCondition} ${filter} ORDER BY s.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

salesModel.deleteSales = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM sales WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


// Return API 
salesModel.upsertSalesReturn = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE sales_return SET invoiceNo = ?, r_qty=?, s_price=?, unit= ?, r_desc=?, status =?, updated_on = NOW() WHERE id = ? and sel_id = ?`;
    const insertSql = `INSERT INTO sales_return (sel_id, c_id, p_id, product_id, invoiceNo, r_qty, s_price, unit, r_desc, salesName, status, created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.invoiceNo,
                body.qty,
                body.salesPrice,
                body.unit,
                body.rDesc,
                body.status,
                body.id,
                body.salesId,

            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.salesId,
                body.customer,
                body.productionId,
                body.product,
                body.invoiceNo,
                body.qty,
                body.salesPrice,
                body.unit,
                body.rDesc,
                body.salesName,
                body.status
            ]);
            const salesId = insertResult.insertId;
            return { insertId: salesId };
        }
    } finally {
        connection.release();
    }
};


const return_config = [
    { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'prd.id', condition: conditionEnum.EQ },
];

salesModel.getSalesReturnList = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, return_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM sales_return sr
                                    left join sales s on sr.sel_id = s.id
                                    left join production p on sr.p_id = p.id
                                    left join product prd on sr.product_id = prd.id
                                    left join customer c on sr.c_id = c.id ${whereCondition} ${filter}`;
        const listSql = `SELECT sr.id, p.batchNo, sr.salesName, sr.p_id productionId, sr.sel_id salesId, sr.invoiceNo, JSON_OBJECT('id', c.id, 'name', c.name) AS customer, 
                                        JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, 
                                        sr.r_desc rDesc, sr.r_qty qty, sr.s_price salesPrice, sr.unit, sr.status, sr.created_on AS returnDate
                                FROM sales_return sr
                                    left join sales s on sr.sel_id = s.id
                                    left join production p on sr.p_id = p.id
                                    left join product prd on sr.product_id = prd.id
                                    left join customer c on sr.c_id = c.id
        ${whereCondition} ${filter} ORDER BY sr.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

salesModel.deleteSalesReturn = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM sales_return WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

salesModel.getSalesDetails = async (productId, customerId) => {
    const connection = await db.getConnection();
    try {
        const sql = `SELECT id, p_id FROM sales WHERE c_id = ? AND p_id = ?`;
        const [[result]] = await connection.query(sql, [customerId, productId]);
        return result;
    } finally {
        connection.release();
    }
};

salesModel.getSalesItemAvailableQty = async ({ productId,productionId, customerId, type, salesId }) => {
    const connection = await db.getConnection();
    let idCondition = salesId ? ` AND s.id != ${salesId}` : "";

    const salesQtySql = `SELECT s.id salesId, p.id AS productionId,
                            CAST(p.qty AS DECIMAL(10, 0)) AS totalQty,
                            IFNULL(SUM(CAST(s.qty AS DECIMAL(10, 0))), 0) AS usedQty,
                            CAST(p.qty AS DECIMAL(10, 0)) - IFNULL(SUM(CAST(s.qty AS DECIMAL(10, 0))), 0) AS availableQty
                                FROM production p
                                    LEFT JOIN sales s ON p.id = s.productionId ${idCondition}
                                    WHERE p.product = ? and p.id= ?
                                    GROUP BY p.id, p.product, p.qty`;
    const returnQtySql = `SELECT  s.id AS salesId, s.c_id AS customerId, s.p_id AS productId,
                            CAST(s.qty AS DECIMAL(10, 0)) AS totalQty,
                            IFNULL(SUM(CAST(sr.r_qty AS DECIMAL(10, 0))), 0) AS usedQty,
                            CAST(s.qty AS DECIMAL(10, 0)) - IFNULL(SUM(CAST(sr.r_qty AS DECIMAL(10, 0))), 0) AS availableQty
                                FROM sales s
                                    LEFT JOIN sales_return sr ON s.id = sr.sel_id AND s.c_id = sr.c_id AND s.p_id = sr.product_id 
                                    WHERE s.p_id = ? AND s.c_id = ? AND s.id = ${salesId}
                                    GROUP BY s.id, s.c_id, s.p_id, s.qty`;

    try {
        const query = type === "sales" ? salesQtySql : returnQtySql;
        const params = type === "sales" ? [productId, productionId] : [productId, customerId];
        const [rows] = await connection.query(query, params);

        if (!rows || rows.length === 0) {
            return {
                availableQty: 0
            };
        }

        return rows[0];
    } finally {
        connection.release();
    }
};


salesModel.getExitingSalesProductDetails = async (id, cId, salesId) => {
    const connection = await db.getConnection();
    const returnSql = `select id from sales_return where product_id = ? and c_id =? and sel_id = ?`;

    try {
        const [[result]] = await connection.query(returnSql, [id, cId, salesId]);
        return result;
    } finally {
        connection.release();
    }
};

export default salesModel;
