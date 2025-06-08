import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const materialsModel = {};
const conditionEnum = filterService.condition;


materialsModel.upsertMaterial = async (body) => {
    const connection = await db.getConnection();
    const updateSql = `UPDATE materials SET mqty =?, mPrice =? , rqty =?, rPrice =?, lqty =?, lPrice =?  WHERE id = ?`;
    const insertSql = `INSERT INTO materials (productionId, product, s_id, mqty, mPrice, rqty, rPrice, lqty, lPrice,  created_on) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            await connection.query(updateSql, [
                body.mqty,
                body.mPrice,
                body.rqty,
                body.rPrice,
                body.lqty,
                body.lPrice,
                body.id,
            ]);
            return true;
        } else {
            await connection.query(insertSql, [
                body.productionId,
                body.product,
                body.supplier,
                body.mqty,
                body.mPrice,
                body.rqty,
                body.rPrice,
                body.lqty,
                body.lPrice,
            ]);
            return true;
        }
    } finally {
        connection.release();
    }
};

// const production_config = [
//     { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
//     { inputKey: "pName", column: 'pd.name', condition: conditionEnum.CONTAIN },
// ];

materialsModel.getMaterials = async (id) => {
    const connection = await db.getConnection();

    try {
        const listSql = `SELECT m.id, m.productionId, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, JSON_OBJECT('id', pr.id, 'name', pr.name) AS product, 
        m.mqty, m.mPrice, m.rqty, m.rPrice, m.lqty, m.lPrice, m.created_on 
        FROM materials m
         LEFT JOIN product pr ON m.product = pr.id
         JOIN supplier s ON m.s_id = s.id
         where m.productionId = ${id}
            ORDER BY m.id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

materialsModel.getMaterialsByProductionId = async (productionId, id, supplierId) => {
    const connection = await db.getConnection();

    try {
        const listSql = `SELECT m.id, m.productionId, 
        JSON_OBJECT('id', pr.id, 'product', pr.name) AS product, 
        m.mqty, m.mPrice, m.rqty, m.rPrice, m.lqty, m.lPrice, m.created_on 
        FROM materials m
        LEFT JOIN product pr ON m.product = pr.id
        where m.productionId = ${productionId} and pr.id = ${id} and m.s_id = ${supplierId}
            ORDER BY m.id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

materialsModel.deleteMaterial = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM materials WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};
materialsModel.getAvailableProductQty = async ({ id, sId }) => {
    const connection = await db.getConnection();
    const returnQtySql = `SELECT pr.p_id AS productId, s.id supplierId, pr.qty,
                                IFNULL(prr.r_qty, 0) AS returnQty,
                                IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0) as mQty,
                                IFNULL(prr.r_qty, 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0)  AS usedQty,
                                pr.qty - (IFNULL(prr.r_qty, 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0)) as availableQty
                            FROM purchase pr
                            JOIN supplier s ON pr.s_id = s.id 
                            left join product  p on pr.p_id = p.id and p.type ="purchase"
                            left join purchase_return prr on p.id = prr.p_id and prr.s_id = s.id
                            left join materials m on p.id = m.product and s.id= m.s_id
                            where pr.p_id= ? and s.id=${sId} GROUP BY p.id`;
    try {
        const [[result]] = await connection.query(returnQtySql, [id]);
        return { availableQty: result.availableQty };
    } finally {
        connection.release();
    }
};

materialsModel.getUsedMaterialsByProductOnProduction = async ({ productId, id }) => {
    const connection = await db.getConnection();
    const listSql = `select * from materials where productionId = ? and product = ?`;

    try {
        const [result] = await connection.query(listSql, [id, productId]);
        return result
    } finally {
        connection.release();
    }
};

export default materialsModel;
