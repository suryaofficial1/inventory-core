import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const productModel = {};
const conditionEnum = filterService.condition;


productModel.upsertProduct = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE product SET name = ?, description = ?, qty = ?, price = ?, unit = ?, status = ? WHERE id = ?`;
    const insertSql = `INSERT INTO product (name, description, qty, price, unit, status, created_on) VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.name,
                body.description,
                body.qty,
                body.price,
                body.unit,
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
    { inputKey: "name", column: 'name', condition: conditionEnum.CONTAIN },
]

productModel.getProducts = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, product_config);
    let finalFilter = filter ? ` where  ${filter} ` : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `select count(*) as total from product ${finalFilter}`
        const listSql = `select id, name, description, qty, price, unit, status from product  ${finalFilter} ORDER BY id DESC limit ${index},${pageSize}`

        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

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