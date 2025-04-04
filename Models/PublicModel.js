import db from "../config/db.js";

const publicModel = {};


publicModel.getSuppliers = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, vendor_code vendorCode from supplier ORDER BY id DESC`
        const [rows] = await connection.query(listSql)
        return rows

    } finally {
        connection.release();
    }
};

publicModel.getCustomers = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name from customer  ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

publicModel.getProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, qty, unit from product ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

publicModel.getAvailableProductQty = async (by, type, id) => {

    const connection = await db.getConnection();
    let byCondition = by === 'purchase' ? ' purchase' : ' sales';
    const returnQtySql = `SELECT COALESCE(SUM(qty), 0) AS availableQty FROM ${byCondition} WHERE p_id = ?`;

    const availableQtySql = `SELECT pr.id, COALESCE(SUM(p.qty), 0) AS totalPurchased, pr.status,
                            CASE 
                                WHEN COUNT(p.qty) > 0 THEN (COALESCE(pr.qty, 0) - COALESCE(SUM(p.qty), 0)) 
                                ELSE COALESCE(pr.qty, 0) END AS availableQty
                            FROM product pr
                                LEFT JOIN ${byCondition} p ON p.p_id = pr.id 
                                WHERE pr.id = ? GROUP BY pr.id, pr.qty`;

    try {
        let result;

        if (type === 'return') {
            console.log(returnQtySql, id)
            const [[rows]] = await connection.query(returnQtySql, [id]);
            result = rows ?? { availableQty: 0 }; // Ensure it never returns null
        } else {
            console.log(availableQtySql, id)
            const [[rows]] = await connection.query(availableQtySql, [id]);
            result = rows ?? { availableQty: 0, totalPurchased: 0, p_id: id };
        }

        return result;
    } finally {
        connection.release();
    }
};


export default publicModel;