import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const productionModel = {};
const conditionEnum = filterService.condition;


productionModel.upsertProduction = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE production SET c_id = ?, m_date = ?, product = ?, unit = ?, qty= ?, operatorName = ? ,p_desc = ? ,status = ? WHERE id = ?`;
    const insertSql = `INSERT INTO production (c_id, batchNo, m_date, product, unit, qty, operatorName,  p_desc, status, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
           await connection.query(updateSql, [
                body.customer,
                body.manufacturingDate,
                body.product,
                body.unit,
                body.qty,
                body.operatorName,
                body.pDesc,
                body.status,
                body.id,
            ]);
            return { insertId: body.id };
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.customer,
                body.batchNo,
                body.manufacturingDate,
                body.product,
                body.unit,
                body.qty,
                body.operatorName,
                body.pDesc,
                body.status,
            ]);

            const productionId = insertResult.insertId;
            return { insertId: productionId };
        }
    } finally {
        connection.release();
    }
};

const production_config = [
    { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'p.product', condition: conditionEnum.EQ },
];

productionModel.getProductions = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, production_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    const pageSize = reqData.per_page;
    const index = (reqData.page - 1) * pageSize;

    try {
        // Total count query
        const countSql = `SELECT COUNT(*) as total 
                          FROM production p
                          left join product pr on p.product = pr.id
                          LEFT JOIN customer c ON p.c_id = c.id 
                          ${whereCondition} ${filter}`;

        // List query with customer info
        const listSql = `
            SELECT 
                p.id, 
                p.batchNo,
                JSON_OBJECT('id', c.id, 'name', c.name) AS customer, 
                p.m_date AS manufacturingDate,
                JSON_OBJECT('id', pr.id, 'name', pr.name) AS product, 
                p.unit, 
                p.qty, 
                p.operatorName, 
                p.p_desc AS pDesc, 
                p.status
            FROM production p 
            left join product pr on p.product = pr.id
            LEFT JOIN customer c ON p.c_id = c.id
            ${whereCondition} ${filter}
            ORDER BY p.id DESC
            LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);

        // Extract productionIds for materials fetch
        const productionIds = rows.map(row => row.id);

        let materialsMap = {};

        if (productionIds.length) {
            const [materials] = await connection.query(`
                SELECT m.id, m.productionId,  JSON_OBJECT('id', pr.id, 'name', pr.name) AS product, m.mqty,
                             m.mPrice, m.rqty, m.rPrice, m.lqty, m.lPrice, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier
                FROM materials m
                    LEFT JOIN product pr ON m.product = pr.id
                    left join supplier s on m.s_id = s.id
                     WHERE productionId IN (?) `, [productionIds]);

            // Group materials by productionId
            materialsMap = materials.reduce((acc, mat) => {
                if (!acc[mat.productionId]) acc[mat.productionId] = [];
                acc[mat.productionId].push(mat);
                return acc;
            }, {});
        }

        // Attach materials array to each production row
        const enrichedRows = rows.map(row => ({
            ...row,
            materials: materialsMap[row.id] || []
        }));

        return { rows: enrichedRows, ...count };
    } finally {
        connection.release();
    }
};

productionModel.getProductionDetail = async (id) => {
    const connection = await db.getConnection();

    try {
        const listSql = `SELECT p.id, p.batchNo, JSON_OBJECT('id', c.id, 'name', c.name) AS customer, p.m_date AS pDate,
                         JSON_OBJECT('id', pr.id, 'name', pr.name) AS product, p.unit, p.qty, p.operatorName, p.p_desc AS pDesc, p.status, count(m.id) as materialCount
                            FROM production p 
                            left join product pr on p.product = pr.id
                            LEFT JOIN customer c ON p.c_id = c.id
                            LEFT JOIN materials m ON p.id = m.productionId
                            where p.id = ${id}  `;

        const [[rows]] = await connection.query(listSql);

        return rows;
    } finally {
        connection.release();
    }
};

productionModel.getProductionDetailByProduct = async (id, batchNo) => {
    const connection = await db.getConnection();
    try {
        const listSql = `select p.id, p.batchNo, JSON_OBJECT('id', pr.id, 'name', pr.name) AS product, JSON_OBJECT('id', c.id, 'name', c.name) AS customer, 
                            p.qty, p.unit, p.operatorName, p.m_date manufacturingDate, p.status
                                from production p
                                    left join product pr on p.product = pr.id
                                    left join customer c on p.c_id = c.id
                                     where pr.id = ${id} and p.batchNo = ?
                                        ORDER BY p.id DESC`;

        const [[rows]] = await connection.query(listSql, [batchNo]);

        return rows;
    } finally {
        connection.release();
    }
};

productionModel.updateProductionStatus = async (status, id) => {
    const connection = await db.getConnection();
    try {
        const sql = `UPDATE production set status = ? WHERE id = ?`;
        await connection.query(sql, [status, id]);
        return true;
    } finally {
        connection.release();
    }
};
productionModel.deleteProduction = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM production WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default productionModel;
