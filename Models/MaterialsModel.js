import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const materialsModel = {};
const conditionEnum = filterService.condition;


materialsModel.upsertMaterial = async (body) => {
    const connection = await db.getConnection();
    const updateSql = `UPDATE materials SET  productionId=?, product = ?, mqty =?, mPrice =? , rqty =?, rPrice =?, lqty =?, lPrice =?  WHERE id = ?`;
    const insertSql = `INSERT INTO materials (productionId, product, mqty, mPrice, rqty, rPrice, lqty, lPrice,  created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            await connection.query(updateSql, [
                body.productionId,
                body.product,
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
        const listSql = `SELECT m.id, m.productionId, 
        JSON_OBJECT('id', p.id, 'product', p.product) AS product, 
        m.mqty, m.mPrice, m.rqty, m.rPrice, m.lqty, m.lPrice, m.created_on 
        FROM materials m
         LEFT JOIN purchase p ON m.product = p.id
         where m.productionId = ${id}
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
materialsModel.getAvailableProductQty = async (id) => {
    const connection = await db.getConnection();
    const returnQtySql = `SELECT 
                            p.id AS productId,
                            CAST(ANY_VALUE(p.qty) AS DECIMAL(10, 0)) AS totalQty,
                            SUM(CAST(m.mqty AS DECIMAL(10, 0))) AS mqty,
                            SUM(CAST(m.rqty AS DECIMAL(10, 0))) AS rqty,
                            IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0)) + CAST(m.rqty AS DECIMAL(10, 0))), 0) AS usedQty,
                            CAST(ANY_VALUE(p.qty) AS DECIMAL(10, 0)) - 
                                IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0)) + CAST(m.rqty AS DECIMAL(10, 0))), 0) AS availableQty
                        FROM 
                            purchase p
                        LEFT JOIN 
                            materials m ON m.product = p.id
                        WHERE 
                            p.id = ?
                        GROUP BY 
                            p.id`;

    try {
        const [[result]] = await connection.query(returnQtySql, [id]);
        return { availableQty: result.availableQty };
    } finally {
        connection.release();
    }
};

export default materialsModel;
