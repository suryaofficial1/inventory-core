import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const reportModel = {};
const conditionEnum = filterService.condition;


const sales_config = [
    { inputKey: "customer", column: 'c.id', condition: conditionEnum.EQ },
    { inputKey: "product", column: 'p.name', condition: conditionEnum.CONTAIN },
    { inputKey: "startDate", column: 'DATE(s.s_date)', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "endDate", column: 'DATE(s.s_date)', condition: conditionEnum.LESS_THAN_EQUAL },
];

reportModel.getSalesOverview = async (reqData) => {
    const connection = await db.getConnection();
    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, sales_config);
        // const whereClause = whereCondition ? `  ${whereCondition}` : `s.s_date >= CURDATE() - INTERVAL 30 DAY`;
        const listSql = `SELECT s.id, s.invoiceNo, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                              JSON_OBJECT('id', p.id, 'name', p.name) AS product,
							  s.p_desc AS pDesc, s.qty, s.s_price AS salesPrice, s.unit, s.status,
                               DATE_FORMAT(s.s_date, '%d/%m/%Y') AS salesDate
                            FROM sales s
                            LEFT JOIN production prd ON prd.id = s.productionId
                            left join product p on s.p_id = p.id
                            LEFT JOIN customer c ON c.id = s.c_id
                            where ${whereCondition}
                            group by s.id, customer, product 
                            order by s.s_date asc limit ${index},${pageSize}`;
        const totalSql = `SELECT count(s.id) as total
                        FROM sales s
                            LEFT JOIN production prd ON prd.id = s.productionId
                            left join product p on s.p_id = p.id
                            LEFT JOIN customer c ON c.id = s.c_id
                        where ${whereCondition}`;

        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};
const sales_return_config = [
    { inputKey: "customer", column: 'c.id', condition: conditionEnum.EQ },
    { inputKey: "product", column: 'p.name', condition: conditionEnum.CONTAIN },
    { inputKey: "startDate", column: 'DATE(s.created_on)', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "endDate", column: 'DATE(s.created_on)', condition: conditionEnum.LESS_THAN_EQUAL },
];
reportModel.getSalesReturnOverview = async (reqData) => {
    const connection = await db.getConnection();

    try {
        let pageSize = reqData.per_page;
        let index = (reqData.page - 1) * pageSize;
        const whereCondition = filterService.generateFilterSQL(reqData, sales_return_config);
        const listSql = `SELECT  sr.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                            JSON_OBJECT('id', prd.id, 'name', prd.name) AS product,
                            sr.r_qty qty, 
                            sr.s_price AS salesReturnPrice, 
                            sr.unit, DATE_FORMAT(s.created_on, '%d/%m/%Y') AS salesDate

                        FROM sales_return sr
                                    left join sales s on sr.sel_id = s.id
                                    left join production p on sr.p_id = p.id
                                    left join product prd on sr.product_id = prd.id
                                    left join customer c on sr.c_id = c.id
                           WHERE  ${whereCondition} 
                            GROUP BY sr.id, salesDate, customer, product, sr.unit
                            ORDER BY salesDate asc limit ${index},${pageSize}`;
        const totalSql = `SELECT COUNT(sr.id) AS total 
                                FROM sales_return sr
                                    left join sales s on sr.sel_id = s.id
                                    left join production p on sr.p_id = p.id
                                    left join product prd on sr.product_id = prd.id
                                    left join customer c on sr.c_id = c.id
                                WHERE  ${whereCondition}`;

        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const purchase_config = [
    { inputKey: "supplier", column: 's.id', condition: conditionEnum.EQ },
    { inputKey: "product", column: 'prd.name', condition: conditionEnum.CONTAIN },
    { inputKey: "startDate", column: 'DATE(pr.p_date)', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "endDate", column: 'DATE(pr.p_date)', condition: conditionEnum.LESS_THAN_EQUAL },
];

reportModel.getPurchaseReports = async (reqData) => {
    const connection = await db.getConnection();
    try {
        let pageSize = reqData.per_page;
        let index = (reqData.page - 1) * pageSize;
        const whereCondition = filterService.generateFilterSQL(reqData, purchase_config);
        const listSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber, pr.qty, pr.price purchaseAmount, pr.unit,
                                JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, JSON_OBJECT('id', prd.id, 'name', prd.name) AS product,
                                DATE_FORMAT(pr.p_date, '%d/%m/%Y') AS purchaseDate,
                                DATE_FORMAT(pr.e_date, '%d/%m/%Y') AS purchaseExpiryDate
                                    FROM purchase pr
                                        LEFT JOIN product prd on pr.p_id = prd.id
                                        LEFT JOIN supplier s ON pr.s_id = s.id
                                        WHERE  ${whereCondition} 
                                            GROUP BY pr.id, supplier, product, pr.unit
                                            ORDER BY purchaseDate asc limit ${index},${pageSize}`;
        const totalSql = `SELECT count(pr.id) as total FROM purchase pr
                                    LEFT JOIN product prd on pr.p_id = prd.id
                                    LEFT JOIN supplier s ON pr.s_id = s.id
                                    WHERE ${whereCondition}`;
        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

const purchase_return_config = [
    { inputKey: "supplier", column: 's.id', condition: conditionEnum.EQ },
    { inputKey: "product", column: 'prd.name', condition: conditionEnum.CONTAIN },
    { inputKey: "startDate", column: 'DATE(pr.created_on)', condition: conditionEnum.GREATER_THAN_EQUAL },//pr.created_on', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "endDate", column: 'DATE(pr.created_on)', condition: conditionEnum.LESS_THAN_EQUAL },
];
reportModel.getPurchaseReturnReports = async (reqData) => {
    const connection = await db.getConnection();
    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, purchase_return_config);
        const listSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber,  JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                                 JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, 
                                 pr.r_qty qty, pr.price returnAmount, pr.unit, 
                                 DATE_FORMAT(pr.created_on, '%Y-%m-%d') AS returnDate
                                    FROM purchase_return pr
                                            LEFT JOIN product prd on pr.p_id = prd.id
                                            LEFT JOIN  supplier s ON pr.s_id = s.id
                                                where  ${whereCondition} 
                                                GROUP BY pr.id, supplier, product, pr.unit
                                                ORDER BY returnDate asc limit ${index},${pageSize}`;
        const totalSql = `SELECT count(pr.id) as total 
                               FROM purchase_return pr
                                    LEFT JOIN product prd on pr.p_id = prd.id
                                    LEFT JOIN  supplier s ON pr.s_id = s.id
                                        WHERE  ${whereCondition}`;
        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        console.log("list sql ", listSql);
        return { rows, total };
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        connection.release();
    }
}

reportModel.getStockReports = async (reqData) => {
    const connection = await db.getConnection();
    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    const stock_config = [
        { inputKey: "product", column: 'prd.name', condition: conditionEnum.CONTAIN },
        ...(reqData.type === "sales"
            ? [
                { inputKey: "startDate", column: 'DATE(p.m_date)', condition: conditionEnum.GREATER_THAN_EQUAL },
                { inputKey: "endDate", column: 'DATE(p.m_date)', condition: conditionEnum.LESS_THAN_EQUAL }
            ]
            : [
                { inputKey: "startDate", column: 'DATE(pr.created_on)', condition: conditionEnum.GREATER_THAN_EQUAL },
                { inputKey: "endDate", column: 'DATE(pr.created_on)', condition: conditionEnum.LESS_THAN_EQUAL }
            ])
    ];

    const whereCondition = filterService.generateFilterSQL(reqData, stock_config);

    try {

        const purchaseStockListSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber, pr.qty purchaseQty, pr.price purchaseAmount, pr.unit,
                                JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, JSON_OBJECT('id', prd.id, 'name', prd.name) AS product,
                                DATE_FORMAT(pr.p_date, '%d/%m/%Y') AS purchaseDate,
                                DATE_FORMAT(pr.e_date, '%d/%m/%Y') AS purchaseExpiryDate,
                                CAST(pr.qty AS DECIMAL(10, 0)) - (IFNULL(CAST(prr.r_qty AS DECIMAL(10, 0)), 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0)) AS stockQty
                                    FROM purchase pr
                                        LEFT JOIN product prd on pr.p_id = prd.id 
                                        left join purchase_return prr on prd.id = prr.p_id and  pr.id = prr.pr_id and pr.s_id = prr.s_id
                                        left join materials m on pr.p_id = m.product and pr.s_id = m.s_id
                                       LEFT JOIN supplier s ON pr.s_id = s.id
                                        WHERE  ${whereCondition}  
                                            GROUP BY pr.id, supplier, product, pr.unit
                                            ORDER BY purchaseDate asc limit ${index},${pageSize}`;
        const purchaseStockCountSql = `SELECT count(pr.id) as total FROM purchase pr
                                        LEFT JOIN product prd on pr.p_id = prd.id 
                                        left join purchase_return prr on prd.id = prr.p_id and  pr.id = prr.pr_id and pr.s_id = prr.s_id
                                        left join materials m on pr.p_id = m.product and pr.s_id = m.s_id
                                       LEFT JOIN supplier s ON pr.s_id = s.id
                                    WHERE ${whereCondition}`;


        const salesStockListSql = `SELECT p.id, p.unit, DATE_FORMAT(p.created_on, '%d / %m / %Y') AS manufacturingDate,
                                        JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, p.operatorName, p.qty manufacturingQty, 
                                        IFNULL(SUM(CAST(s.qty AS DECIMAL(10, 0))), 0) salesQty ,(p.qty - IFNULL(SUM(CAST(s.qty AS DECIMAL(10, 0))), 0)) stockQty, s.s_price AS salesPrice
                                            FROM production p
                                                left join product prd on p.product = prd.id
                                                left join sales s on p.product = s.p_id and p.id = s.productionId
                                                left join customer c on s.c_id = c.id
                                            WHERE  ${whereCondition} 
                                            group by p.id order by p.m_date asc limit ${index},${pageSize}`;
        const salesStockCountSql = `SELECT COUNT(p.id) AS total 
                                        FROM production p
                                        left join product prd on p.product = prd.id
                                        left join sales s on p.product = s.p_id and p.id = s.productionId
                                        left join customer c on s.c_id = c.id
                                WHERE  ${whereCondition}`;
        let listSql = '';
        let totalSql = '';
        if (reqData.type == "sales") {
            listSql = salesStockListSql;
            totalSql = salesStockCountSql;
        } else {
            listSql = purchaseStockListSql;
            totalSql = purchaseStockCountSql;
        }
        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        connection.release();
    }
}

reportModel.getProductTimeline = async (reqData) => {
    const connection = await db.getConnection();
    const purchaseTypeProductSql = `( SELECT p.id, p.id AS product_id, 'Product Created' AS action, p.name AS product_name, NULL AS reference, p.qty quantity, p.price AS price, p.unit AS unit, null as invoiceNo, null as batchNo, p.description, null as manufBy, p.created_on AS action_time FROM product p WHERE p.id = ? )
                                UNION ALL
                                 ( SELECT pu.id , pu.p_id AS product_id, 'Product Purchased' AS action, pr.name AS product_name, JSON_OBJECT('id', s.id, 'name', s.name) AS reference, pu.qty AS quantity, pu.price AS price, pu.unit AS unit, pu.invoiceNo , pu.b_num as batchNo, pu.description, null as manufBy, pu.created_on AS action_time FROM purchase pu JOIN product pr ON pr.id = pu.p_id JOIN supplier s ON pu.s_id = s.id WHERE pu.p_id = ? )
                                UNION ALL
                                 ( SELECT prr.id, prr.p_id AS product_id, 'Purchase Returned' AS action, p.name AS product_name, JSON_OBJECT('id', s.id, 'name', s.name) AS reference, prr.r_qty AS quantity, prr.price AS price, prr.unit AS unit, prr.invoiceNo , prr.b_num as batchNo, p.description, null as manufBy, prr.created_on AS action_time FROM purchase_return prr JOIN product p ON p.id = prr.p_id JOIN supplier s ON prr.s_id = s.id WHERE prr.p_id = ? )
                                UNION ALL
                                 ( SELECT m.id, m.product AS product_id, 'Used in Production' AS action, p.name AS product_name, JSON_OBJECT('producationId', pr.id, 'operatorName', pr.operatorName) AS reference, m.mqty AS quantity, m.mPrice AS price, p.unit AS unit, null as invoiceNo, null as batchNo, null as  description, JSON_OBJECT('id', productionPrd.id, 'name', productionPrd.name) as manufBy, m.created_on AS action_time FROM materials m JOIN product p ON p.id = m.product join production pr on m.productionId = pr.id left join product productionPrd on pr.product = productionPrd.id WHERE m.product = ? )
                                ORDER BY action_time ASC`;

    const salesTypeProductSql = `( SELECT p.id , p.id AS product_id, 'Product Created' AS action, p.name AS product_name, NULL AS reference, p.qty AS quantity, p.price AS price, p.unit AS unit, NULL AS invoiceNo, p.description, p.created_on AS action_time FROM product p WHERE p.id = ? )
                                    UNION ALL
                                    ( SELECT pr.id , pr.product AS product_id, 'Production Entry' AS action, p.name AS product_name, JSON_OBJECT('id', pr.id, 'operatorName', pr.operatorName) AS reference, pr.qty AS quantity, NULL AS price, pr.unit AS unit, NULL AS invoiceNo, pr.p_desc AS description, pr.created_on AS action_time FROM production pr JOIN product p ON p.id = pr.product LEFT JOIN customer c ON c.id = pr.c_id WHERE pr.product = ? )
                                    UNION ALL
                                    ( SELECT s.id , s.p_id AS product_id, 'Sales' AS action, p.name AS product_name, JSON_OBJECT('id', c.id, 'name', c.name) AS reference, s.qty AS quantity, s.s_price AS price, s.unit AS unit, s.invoiceNo, s.p_desc AS description, s.created_on AS action_time FROM sales s JOIN product p ON p.id = s.p_id LEFT JOIN customer c ON c.id = s.c_id WHERE s.p_id = ? )
                                    UNION ALL
                                    ( SELECT sr.id , sr.product_id AS product_id, 'Sales Return' AS action, p.name AS product_name, JSON_OBJECT('id', c.id, 'name', c.name) AS reference, sr.r_qty AS quantity, sr.s_price AS price, sr.unit AS unit, sr.invoiceNo, sr.r_desc, sr.created_on AS action_time FROM sales_return sr JOIN product p ON p.id = sr.product_id LEFT JOIN customer c ON c.id = sr.c_id WHERE sr.product_id = ? )
                                    ORDER BY action_time ASC`
    let listSql = '';
    if (reqData.type == "purchase") {
        listSql = purchaseTypeProductSql;
    } else {
        listSql = salesTypeProductSql;
    }
    try {
        const [rows] = await connection.query(listSql, [reqData.id, reqData.id, reqData.id, reqData.id, reqData.id]);
        return rows;

    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        connection.release();
    }
}

export default reportModel;
