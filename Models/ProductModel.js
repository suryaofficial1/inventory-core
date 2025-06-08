import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const productModel = {};
const conditionEnum = filterService.condition;


productModel.upsertProduct = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE product SET name = ?, description = ?, qty = ?, price = ?, unit = ?, type=?, status = ? WHERE id = ?`;
    const insertSql = `INSERT INTO product (name, description, qty, price, unit, type, status, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.name,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.type,
                body.status,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.name,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.type,
                body.status,
            ]);

            const productId = insertResult.insertId;
            return { insertId: productId };
        }
    } finally {
        connection.release();
    }
};

const product_config = [
    { inputKey: "productId", column: 'id', condition: conditionEnum.EQ },
    { inputKey: "type", column: 'type', condition: conditionEnum.CONTAIN },
]

productModel.getProducts = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, product_config);
    let finalFilter = filter ? ` where  ${filter} ` : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `select count(*) as total from product ${finalFilter}`
        const listSql = `select id, name, description, qty, price, unit, type, status from product  ${finalFilter} ORDER BY id DESC limit ${index},${pageSize}`

        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

    } finally {
        connection.release();
    }
};

productModel.checkProductExists = async (name, type, id = null) => {
    const connection = await db.getConnection();
    try {
        let sql = `SELECT id FROM product WHERE name = ? AND type = ?`;
        const params = [name, type];

        if (id !== null) {
            sql += ` AND id != ?`;
            params.push(id);
        }
        const [[result]] = await connection.query(sql, params);
        return result || null;
    } finally {
        connection.release();
    }
};


productModel.deleteProduct = async (id) => {
    const connection = await db.getConnection();
    try {
        const deleteSql = `delete from product where id = ?`
        const [result] = await connection.query(deleteSql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


export default productModel;