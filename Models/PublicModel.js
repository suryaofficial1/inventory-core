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

publicModel.getProducts = async (type, product = "") => {
    let where = [];

    if (type !== 'all') {
        where.push(`type = '${type}'`);
    }

    if (product) {
        where.push(`name like '%${product}%'`);
    }

    const condition = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const connection = await db.getConnection();

    try {
        const listSql = `SELECT id, name, qty, unit, price FROM product ${condition} ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};


publicModel.getPurchaseProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select p.id purchaseId, pr.id, pr.name, pr.qty, pr.price, pr.unit, pr.description 
        from purchase p 
			join product pr on p.p_id = pr.id and type ="purchase"
             ORDER BY id DESC`;
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

publicModel.getProductionProductsDetails = async (product, status) => {
    const connection = await db.getConnection();
    let condition = "";
    if (status != "all") {
        condition = ` and p.status = '${status}'`;
    }
    try {
        const listSql = `select p.id, p.batchNo, JSON_OBJECT('id', pr.id, 'name', pr.name) AS product, JSON_OBJECT('id', c.id, 'name', c.name) AS customer, 
                            p.qty, p.unit, p.operatorName, p.m_date manufacturingDate, p.status
                                from production p
                                    left join product pr on p.product = pr.id
                                    left join customer c on p.c_id = c.id
                                     where pr.name like '%${product}%' ${condition}
                                        ORDER BY p.id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

publicModel.getSalesProducts = async (product, cId) => {
    const connection = await db.getConnection();
    let condition = "";
    if (cId) {
        condition = ` and c.id = '${cId}'`;
    }
    try {
        const listSql = `select s.id, s.salesName, s.productionId, prd.batchNo,  JSON_OBJECT('id', p.id, 'name', p.name) AS product, JSON_OBJECT('id', c.id, 'name', c.name) AS customer, s.qty, s.unit, s.invoiceNo, s.s_price 
                                 FROM sales s
                                    LEFT JOIN production prd ON prd.id = s.productionId
                                    left join product p on s.p_id = p.id
                                    LEFT JOIN customer c ON c.id = s.c_id
                                        where p.name like '%${product}%' ${condition}
                                         ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

publicModel.getSalesReturnProducts = async (product) => {
    const connection = await db.getConnection();
    try {
        const listSql = `SELECT sr.id, JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, JSON_OBJECT('id', c.id, 'name', c.name) AS customer
                            FROM sales_return sr
                                left join sales s on sr.sel_id = s.id
                                left join production p on sr.p_id = p.id
                                left join product prd on sr.product_id = prd.id
                                left join customer c on sr.c_id = c.id
                                    where prd.name like '%${product}%'
                                        ORDER BY sr.id DESC`;
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
            sql: `SELECT COUNT(DISTINCT id) AS value FROM customer`,
            title: "Customers",
            icon: `<FileText size={28} color="#fff" />`,
            bgColor: '#3FB6D9',
        },
        {
            sql: `SELECT COUNT(DISTINCT id) AS value FROM supplier`,
            title: 'Supplier',
            icon: ` <FileText size={28} color="#fff" />`,
            bgColor: '#3EB780',
        },
        {
            sql: `SELECT SUM(CAST(qty AS DECIMAL(10,2)) * CAST(s_price AS DECIMAL(10,2))) AS value FROM sales WHERE s_date >= CURDATE() - INTERVAL 90 DAY`,
            title: "Total Sales",
            icon: ` <FileText size={28} color="#fff" />`,
            bgColor: '#FFA73B',
        },
        {
            sql: `SELECT SUM(CAST(r_qty AS DECIMAL(10,2)) * CAST(s_price AS DECIMAL(10,2))) AS value FROM sales_return WHERE created_on >= CURDATE() - INTERVAL 90 DAY`,
            title: "Total Sales Return",
            icon: ` <RefreshCw size={28} color="#fff" />`,
            bgColor: '#0B1C3F'
        },
        {
            sql: `SELECT SUM(CAST(qty AS DECIMAL(10,2)) * CAST(price AS DECIMAL(10,2))) AS value FROM purchase WHERE p_date >= CURDATE() - INTERVAL 90 DAY`,
            title: "Total Purchase",
            icon: `<Gift size={28} color="#fff" />`,
            bgColor: '#009688'
        },
        {
            sql: `SELECT SUM(CAST(r_qty AS DECIMAL(10,2)) * CAST(price AS DECIMAL(10,2))) AS value FROM purchase_return WHERE created_on >= CURDATE() - INTERVAL 90 DAY`,
            title: "Total Purchase Return",
            icon: `<Shield size={28} color="#fff" />`,
            bgColor: '#2563EB'
        },
    ];

    try {
        const results = await Promise.all(
            queries.map(q => connection.query(q.sql).then(([rows]) => ({
                icon: q.icon,
                bgColor: q.bgColor,
                title: q.title,
                value: Number(rows[0].value) || 0
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


publicModel.getProductNameByType = async (product, type) => {
    const connection = await db.getConnection();

    const purchaseProductSql = `select p.id, p.name from purchase pr 
                                left join product p on pr.p_id = p.id where p.name like '%${product}%' and p.type = 'purchase' group by p.id`;
    const purchaseReturnSql = `select p.id, p.name from purchase_return pr 
                                left join product p on pr.p_id = p.id where p.name like '%${product}%' and p.type = 'purchase' group by p.id`;
    const salesProductSql = `select p.id, p.name from sales s 
                                left join product p on s.p_id = p.id where p.name like '%${product}%' and p.type = 'sales' group by p.id`;
    const salesReturnSql = `select p.id, p.name from sales_return sr 
                                left join product p on sr.product_id = p.id where p.name like '%${product}%' and p.type = 'sales' group by p.id`;

    let listSql = ''
    if (type == 'purchase') {
        listSql = purchaseProductSql
    } else if (type == 'purchase_return') {
        listSql = purchaseReturnSql
    } else if (type == 'sales') {
        listSql = salesProductSql
    } else if (type == 'sales_return') {
        listSql = salesReturnSql
    }
    try {
        const [result] = await connection.query(listSql);
        return result;
    } finally {
        connection.release();
    }
};




export default publicModel;