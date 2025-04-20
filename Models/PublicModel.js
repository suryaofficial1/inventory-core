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

publicModel.getProducts = async (type) => {
    const connection = await db.getConnection();
    try {
        let condition = type === 'all' ? '' : ` where type = '${type}'`;
        const listSql = `select id, name, qty, unit from product ${condition}  ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

publicModel.getPurchaseProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, product, qty, unit from purchase ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};
publicModel.getProductionProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, product, qty, unit from production ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

publicModel.getAvailableProductQty = async (by, type, id) => {

    const connection = await db.getConnection();
    let byCondition = by === 'purchase' ? ' purchase' : ' sales';
    const returnQtySql = `SELECT qty AS availableQty FROM ${byCondition} WHERE id = ?`;
    try {
        const [[availableQty]] = await connection.query(returnQtySql, [id]);
        return availableQty;
    } finally {
        connection.release();
    }
};

publicModel.getAllStatsCount = async (by, type, id) => {
    const connection = await db.getConnection();

    const queries = [
        {
            sql: `SELECT COUNT(DISTINCT id) AS subTitle FROM customer`,
            title: "Customers",
            image: "./images/customer.png"
        },
        {
            sql: `SELECT COUNT(DISTINCT id) AS subTitle FROM supplier`,
            title: "Suppliers",
            image: "./images/supplier.png"
        },
        {
            sql: `SELECT SUM(CAST(qty AS DECIMAL(10,2)) * CAST(s_price AS DECIMAL(10,2))) AS subTitle FROM sales WHERE s_date >= CURDATE() - INTERVAL 30 DAY`,
            title: "Total Sales",
            image: "./images/sales.png"
        },
        {
            sql: `SELECT SUM(CAST(r_qty AS DECIMAL(10,2)) * CAST(s_price AS DECIMAL(10,2))) AS subTitle FROM sales_return WHERE created_on >= CURDATE() - INTERVAL 30 DAY`,
            title: "Total Sales Return",
            image: "./images/sales-return.png"
        },
        {
            sql: `SELECT SUM(CAST(qty AS DECIMAL(10,2)) * CAST(price AS DECIMAL(10,2))) AS subTitle FROM purchase WHERE p_date >= CURDATE() - INTERVAL 30 DAY`,
            title: "Total Purchase",
            image: "./images/buy.png"
        },
        {
            sql: `SELECT SUM(CAST(r_qty AS DECIMAL(10,2)) * CAST(price AS DECIMAL(10,2))) AS subTitle FROM purchase_return WHERE created_on >= CURDATE() - INTERVAL 30 DAY`,
            title: "Total Purchase Return",
            image: "./images/buy-return.png"
        },
    ];

    try {
        const results = await Promise.all(
            queries.map(q => connection.query(q.sql).then(([rows]) => ({
                images: q.image,
                title: q.title,
                subTitle: Number(rows[0].subTitle) || 0
            })))
        );

        return results;
    } finally {
        connection.release();
    }
};

publicModel.getTop5Products = async (by, type, id) => {
    const connection = await db.getConnection();

    const purchaseSql = `
        SELECT id, product, qty, price
        FROM purchase
        WHERE p_date >= CURDATE() - INTERVAL 30 DAY
        ORDER BY CAST(qty AS DECIMAL(10,0)) DESC
        LIMIT 5`;

    const sellSql = `
        SELECT s.id, pr.product, s.qty, s_price AS price
        FROM sales s
        LEFT JOIN purchase pr ON s.p_id = pr.id
        WHERE s.s_date >= CURDATE() - INTERVAL 30 DAY
        ORDER BY CAST(s.qty AS DECIMAL(10,0)) DESC
        LIMIT 5`;

    try {
        const [top5Purchase] = await connection.query(purchaseSql);
        const [top5Sell] = await connection.query(sellSql);
        return { top5Sell, top5Purchase };
    } finally {
        connection.release();
    }
};

publicModel.getProductionSummary = async (by, type, id) => {
    const connection = await db.getConnection();

    const listSql = `
        SELECT p.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
               p.m_date AS mDate, p.product, p.unit, p.qty, p.operatorName
        FROM production p
        LEFT JOIN customer c ON p.c_id = c.id
        WHERE p.m_date >= CURDATE() - INTERVAL 30 DAY
        ORDER BY m_date DESC`;

    try {
        const [result] = await connection.query(listSql, [id]);
        return result;
    } finally {
        connection.release();
    }
};




export default publicModel;