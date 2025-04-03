import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const purchaseModel = {};
const conditionEnum = filterService.condition;

purchaseModel.upsertPurchase = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE purchase SET s_id = ?, p_id = ?, invoiceNo =?, b_num =?, description = ?, qty = ?, price = ?, unit = ?, status = ?, p_date = ?, e_date = ? WHERE id = ?`;
    const insertSql = `INSERT INTO purchase (s_id, p_id, invoiceNo, b_num, description, qty, price, unit, status, p_date, e_date, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.supplier,
                body.product,
                body.invoiceNo,
                body.bNumber,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.status,
                body.purchaseDate,
                body.expiryDate,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.supplier,
                body.product,
                body.invoiceNo,
                body.bNumber,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.status,
                body.purchaseDate,
                body.expiryDate,
            ]);
            const purchaseId = insertResult.insertId;
            return { insertId: purchaseId };
        }
    } finally {
        connection.release();
    }
};


const sales_config = [
    { inputKey: "sName", column: 's.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'pd.name', condition: conditionEnum.CONTAIN },
];

purchaseModel.getPurchaseList = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, sales_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM purchase p
                            LEFT JOIN supplier s ON p.s_id = s.id
                            LEFT JOIN product pd ON p.p_id = pd.id ${whereCondition} ${filter}`;
        const listSql = `SELECT p.id, invoiceNo, b_num bNumber,  JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                            JSON_OBJECT('id', pd.id, 'name', pd.name ,'qty', pd.qty, 'unit', pd.unit) AS product, 
                            p.description,  p.qty, p.price, p.unit, p.status, p.p_date AS purchaseDate, e_date as expiryDate
                        FROM purchase p
                        LEFT JOIN  supplier s ON p.s_id = s.id
                        LEFT JOIN  product pd ON p.p_id = pd.id
        ${whereCondition} ${filter} ORDER BY p.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

purchaseModel.deletePurchaseDetails = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM purchase WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


// Return API

purchaseModel.getPurchaseByInvoiceNo = async (invoiceNo) => {
    const connection = await db.getConnection();
    try {
        const listSql = `SELECT p.id, p.invoiceNo, p.b_num bNumber,   JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                            JSON_OBJECT('id', pd.id, 'name', pd.name) AS product, 
                            p.description, p_order purchaseOrder,  p.qty, p.price, p.unit, p.status, 
                            p.p_date AS purchaseDate, e_date as expiryDate
                            FROM purchase p
                        LEFT JOIN  supplier s ON p.s_id = s.id
                        LEFT JOIN  product pd ON p.p_id = pd.id
        where p.invoiceNo like '%${invoiceNo}%'`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

purchaseModel.getPurchaseReturnByInvoiceNo = async (invoiceNo) => {
    const connection = await db.getConnection();
    try {
        const listSql = `SELECT pr.id, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                            JSON_OBJECT('id', pd.id, 'name', pd.name) AS product, 
                            pr.r_desc rDesc, pr.r_qty qty, pr.price, pr.unit, pr.created_on AS returnDate
                        FROM purchase_return pr
                        LEFT JOIN  supplier s ON pr.s_id = s.id
                        LEFT JOIN  product pd ON pr.p_id = pd.id
        where pr.invoiceNo = '${invoiceNo}'`;
        const [[rows]] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

purchaseModel.upsertPurchaseReturn = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE purchase_return SET pr_id= ?, p_id= ?, s_id= ?, invoiceNo= ?, b_num= ?, r_qty=?, price=?, unit= ?, r_desc=?, updated_on = NOW() WHERE id = ?`;
    const insertSql = `INSERT INTO purchase_return (pr_id, p_id, s_id, invoiceNo, b_num, r_qty, price, unit, r_desc,  created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.purchaseId,
                body.product,
                body.supplier,
                body.invoiceNo,
                body.bNumber,
                body.qty,
                body.price,
                body.unit,
                body.desc,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.purchaseId,
                body.product,
                body.supplier,
                body.invoiceNo,
                body.bNumber,
                body.qty,
                body.price,
                body.unit,
                body.desc,
            ]);
            const purchaseId = insertResult.insertId;
            return { insertId: purchaseId };
        }
    } finally {
        connection.release();
    }
};


const return_config = [
    { inputKey: "sName", column: 's.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'pd.name', condition: conditionEnum.CONTAIN },
];

purchaseModel.getPurchaseReturnList = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, return_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM purchase_return pr
                            LEFT JOIN supplier s ON pr.s_id = s.id
                            LEFT JOIN product pd ON pr.p_id = pd.id ${whereCondition} ${filter}`;
        const listSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber,  JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                            JSON_OBJECT('id', pd.id, 'name', pd.name) AS product, 
                            pr.r_desc rDesc, pr.r_qty qty, pr.price, pr.unit, pr.created_on AS returnDate
                        FROM purchase_return pr
                        LEFT JOIN  supplier s ON pr.s_id = s.id
                        LEFT JOIN  product pd ON pr.p_id = pd.id
        ${whereCondition} ${filter} ORDER BY pr.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

purchaseModel.deletePurchaseReturn = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM purchase_return WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};



export default purchaseModel;
