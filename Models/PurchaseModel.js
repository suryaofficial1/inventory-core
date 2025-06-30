import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const purchaseModel = {};
const conditionEnum = filterService.condition;

purchaseModel.upsertPurchase = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE purchase SET invoiceNo =?, b_num =?, description = ?, qty = ?, price = ?, unit = ?, p_date = ?, e_date = ? WHERE id = ?`;
    const insertSql = `INSERT INTO purchase (s_id, p_id, invoiceNo, b_num, description, qty, price, unit, p_date, e_date, created_on) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.invoiceNo,
                body.bNumber,
                body.description,
                body.qty,
                body.price,
                body.unit,
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
    { inputKey: "pName", column: 'prd.name', condition: conditionEnum.CONTAIN },
];

purchaseModel.getPurchaseList = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, sales_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM purchase p
                            LEFT JOIN product prd on p.p_id = prd.id
                            LEFT JOIN supplier s ON p.s_id = s.id
                              ${whereCondition} ${filter}`;
        const listSql = `SELECT p.id, invoiceNo, b_num bNumber, JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, p.description,  
                            p.qty, p.price, p.unit, p.status, p.p_date AS purchaseDate,
                             e_date as expiryDate, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier
                        FROM purchase p
                        left join product prd on p.p_id = prd.id
                        LEFT JOIN supplier s ON p.s_id = s.id
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

purchaseModel.getPurchaseByProduct = async (product) => {
    const connection = await db.getConnection();
    try {
        const listSql = `SELECT p.id, p.invoiceNo, p.b_num bNumber,JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, 
                            p.description, p_order purchaseOrder,  p.qty, p.price, p.unit, p.status, 
                            p.p_date AS purchaseDate, e_date as expiryDate, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier
                            FROM purchase p
                                LEFT JOIN product prd on p.p_id = prd.id
                                JOIN supplier s ON p.s_id = s.id
                                where prd.name like '%${product}%'`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

purchaseModel.getPurchaseDetailsByProduct = async ({ product, type }) => {
    const connection = await db.getConnection();
    try {
        const purchaseListSql = `SELECT p.id, p.invoiceNo, p.b_num bNumber,JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, p.unit, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                                        p.qty totalQty, IFNULL(prr.r_qty, 0) AS returnQty, IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0) as mQty, IFNULL(prr.r_qty, 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0)  AS usedQty,
                                        p.qty - (IFNULL(prr.r_qty, 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0)) as availableQty
                                        FROM purchase p
                                            JOIN supplier s ON p.s_id = s.id
                                            left join purchase_return prr on p.p_id = prr.p_id and s.id = p.s_id and p.id= prr.pr_id
                                            LEFT JOIN product prd on p.p_id = prd.id
                                            left join materials m on p.id = m.purchaseId and p.p_id = m.product and s.id = m.s_id
                                            where prd.name like '%${product}%' group by 1,2,3,4,5,6,7 order by p.p_date asc`;
        const purchaseReturnListSql = `select JSON_OBJECT('id', p.id, 'name', p.name) AS product, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier
                                            from purchase_return prr 
                                                left join purchase pr on prr.pr_id = pr.id
                                                left join product p on prr.p_id = p.id and type ="purchase"
                                                JOIN supplier s ON prr.s_id = s.id
                                                    where p.name like '%${product}%'`;
        const listSql = type == "purchase" ? purchaseListSql : purchaseReturnListSql;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

purchaseModel.getPurchaseDetailsByProductId = async ({ purchaseId, productId, sId }) => {
    const connection = await db.getConnection();
    try {
        const purchaseReturnListSql = `select prr.id
                                            from purchase_return prr 
                                                left join purchase pr on prr.pr_id = pr.id
                                                left join product p on prr.p_id = p.id and type ="purchase"
                                                JOIN supplier s ON prr.s_id = s.id
                                                    where p.id = ${productId} and pr_id=${purchaseId} and prr.s_id = ${sId}`;
        const [rows] = await connection.query(purchaseReturnListSql);
        return rows;
    } finally {
        connection.release();
    }
};

purchaseModel.getPurchaseReturnByProduct = async ({ type, product }) => {
    const connection = await db.getConnection();
    const purchaseListSql = `SELECT prd.id, prd.name
                            FROM purchase p
                                LEFT JOIN product prd on p.p_id = prd.id
                                where prd.name like '%${product}%'`;
    const purchaseReturnListSql = `SELECT prd.id, prd.name
                            FROM purchase_return pr
                                LEFT JOIN purchase p on pr.pr_id = p.id
                                LEFT JOIN product prd on pr.p_id = prd.id
                                where prd.name like '%${product}%'`;

    try {
        const listSql = type == "purchase" ? purchaseListSql : purchaseReturnListSql;
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
                            JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, pr.r_desc rDesc, pr.r_qty qty, pr.price, pr.unit, pr.created_on AS returnDate
                        FROM purchase_return pr
                            LEFT JOIN product prd on pr.pr_id = prd.id
                            LEFT JOIN  supplier s ON pr.s_id = s.id
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
    { inputKey: "pName", column: 'prd.name', condition: conditionEnum.CONTAIN },
];

purchaseModel.getPurchaseReturnList = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, return_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM purchase_return pr
                            LEFT JOIN product prd on pr.pr_id = prd.id
                            LEFT JOIN supplier s ON pr.s_id = s.id  ${whereCondition} ${filter}`;
        const listSql = `SELECT pr.id, pr.pr_id purchaseId, pr.invoiceNo, pr.b_num bNumber,  JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                            JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, pr.r_desc rDesc, pr.r_qty qty, pr.price, pr.unit, pr.created_on AS returnDate
                        FROM purchase_return pr
                            LEFT JOIN product prd on pr.p_id = prd.id
                            LEFT JOIN  supplier s ON pr.s_id = s.id
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
