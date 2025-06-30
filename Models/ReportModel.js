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
        const listSql = `SELECT s.id, s.invoiceNo, s.salesName, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
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
        const listSql = `SELECT  sr.id, sr.salesName, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
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
                                            ORDER BY pr.id, purchaseDate asc limit ${index},${pageSize}`;
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
        { inputKey: "startDate", column: 'DATE(p.m_date)', condition: conditionEnum.GREATER_THAN_EQUAL },
        { inputKey: "endDate", column: 'DATE(p.m_date)', condition: conditionEnum.LESS_THAN_EQUAL }
    ];

    const whereCondition = filterService.generateFilterSQL(reqData, stock_config);
    try {

        const salesStockListSql = `SELECT p.id, p.unit, p.batchNo, DATE_FORMAT(p.created_on, '%d / %m / %Y') AS manufacturingDate,
                                        JSON_OBJECT('id', prd.id, 'name', prd.name) AS product, p.operatorName, 
                                        CAST(p.qty AS DECIMAL(10, 0)) manufacturingQty, 
                                        CAST(IFNULL(sum(sr.r_qty), 0) AS DECIMAL(10, 0)) AS returnQty,
                                        IFNULL(SUM(CAST(s.qty AS DECIMAL(10, 0))), 0) salesQty, 
                                        (p.qty - IFNULL(SUM(CAST(s.qty AS DECIMAL(10, 0))), 0)) stockQty,
                                        CAST(s.s_price As DECIMAL(10, 0))  salesPrice
                                            FROM production p
                                                left join product prd on p.product = prd.id
                                                left join sales s on p.product = s.p_id and p.id = s.productionId
                                                left join customer c on s.c_id = c.id
                                                 left join sales_return sr on p.id = sr.p_id and s.id = sr.sel_id
                                            WHERE  ${whereCondition}  
                                            group by p.id order by p.m_date asc limit ${index},${pageSize}`;
        const salesStockCountSql = `SELECT COUNT(p.id) AS total 
                                        FROM production p
                                        left join product prd on p.product = prd.id
                                                left join sales s on p.product = s.p_id and p.id = s.productionId
                                                left join customer c on s.c_id = c.id
                                                 left join sales_return sr on p.id = sr.p_id and s.id = sr.sel_id
                                WHERE  ${whereCondition}`;

        const [rows] = await connection.query(salesStockListSql);
        const [[total]] = await connection.query(salesStockCountSql);
        return { rows, total };
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        connection.release();
    }
}

// reportModel.getProductTimeline = async (reqData) => {
//     const connection = await db.getConnection();
//     const purchaseTypeProductSql = `( SELECT p.id, p.id AS product_id, 'Product Created' AS action, p.name AS product_name, NULL AS reference, p.qty quantity, p.price AS price, p.unit AS unit, null as invoiceNo, null as batchNo, p.description, null as manufBy, p.created_on AS action_time FROM 
//     product p WHERE p.id = ?)
//                                 UNION ALL
//                                  ( SELECT pu.id , pu.p_id AS product_id, 'Product Purchased' AS action, pr.name AS product_name, JSON_OBJECT('id', s.id, 'name', s.name) AS reference, pu.qty AS quantity, pu.price AS price, pu.unit AS unit, pu.invoiceNo , pu.b_num as batchNo, pu.description, null as manufBy, pu.created_on AS action_time FROM purchase pu JOIN product pr ON pr.id = pu.p_id JOIN supplier s ON pu.s_id = s.id WHERE pu.p_id = ? and pu.s_id = ${reqData.supId})
//                                 UNION ALL
//                                  ( SELECT prr.id, prr.p_id AS product_id, 'Purchase Returned' AS action, p.name AS product_name, JSON_OBJECT('id', s.id, 'name', s.name) AS reference, prr.r_qty AS quantity, prr.price AS price, prr.unit AS unit, prr.invoiceNo , prr.b_num as batchNo, p.description, null as manufBy, prr.created_on AS action_time FROM purchase_return prr JOIN product p ON p.id = prr.p_id JOIN supplier s ON prr.s_id = s.id WHERE prr.p_id = ? and prr.s_id = ${reqData.supId})
//                                 UNION ALL
//                                  ( SELECT m.id, m.product AS product_id, 'Used in Production' AS action, p.name AS product_name, JSON_OBJECT('producationId', pr.id, 'operatorName', pr.operatorName) AS reference, m.mqty AS quantity, m.mPrice AS price, p.unit AS unit, null as invoiceNo, null as batchNo, null as  description, JSON_OBJECT('id', productionPrd.id, 'name', productionPrd.name) as manufBy, m.created_on AS action_time FROM materials m JOIN product p ON p.id = m.product join production pr on m.productionId = pr.id left join product productionPrd on pr.product = productionPrd.id WHERE m.product = ? and m.s_id = ${reqData.supId})
//                                 ORDER BY action_time ASC`;

//     const salesTypeProductSql = `( SELECT 
//                                     p.id, 
//                                     p.id AS product_id,
//                                     Product Created' AS action,
//                                     p.name AS product_name,
//                                     NULL AS reference,
//                                     p.qty AS quantity,
//                                     p.price AS price,
//                                     p.unit AS unit,
//                                     NULL AS invoiceNo, 
//                                     p.description,
//                                     p.created_on AS action_time 
//                                     FROM product p WHERE p.id = 43  )
//                               UNION ALL
//                                 ( SELECT 
//                                  pr.id , 
//                                  pr.product AS product_id,
//                                   'Production Entry' AS action,
//                                    p.name AS product_name,
//                                    JSON_OBJECT('id', pr.id, 'operatorName', pr.operatorName) AS reference,
//                                     pr.qty AS quantity, NULL AS price, 
// pr.unit AS unit, NULL AS invoiceNo, pr.p_desc AS description, pr.created_on AS action_time 
//  FROM production pr JOIN product p ON p.id = pr.product LEFT JOIN customer c ON c.id = pr.c_id WHERE pr.product = 43 and batchNo=123  )
// UNION ALL 
// ( SELECT s.id , s.p_id AS product_id, 'Sales' AS action, p.name AS product_name, JSON_OBJECT('id', c.id, 'name', c.name) AS reference,
//  s.qty AS quantity, s.s_price AS price, s.unit AS unit, s.invoiceNo, s.p_desc AS description, s.created_on AS action_time 
//   FROM sales s 
//   left join production prd on s.productionId = prd.id
//   JOIN product p ON p.id = s.p_id LEFT JOIN customer c ON c.id = s.c_id WHERE s.p_id = 43 and prd.batchNo=123 )
//  UNION ALL
// ( SELECT sr.id , sr.product_id AS product_id, 'Sales Return' AS action, p.name AS product_name, JSON_OBJECT('id', c.id, 'name', c.name) AS reference,
// sr.r_qty AS quantity, sr.s_price AS price, sr.unit AS unit, sr.invoiceNo, sr.r_desc, sr.created_on AS action_time 
//  FROM sales_return sr JOIN product p ON p.id = sr.product_id 
// left join production prd on sr.p_id = prd.id
// LEFT JOIN customer c ON c.id = sr.c_id WHERE sr.product_id = 43 and prd.batchNo=123) 
// 	ORDER BY action_time ASC`
//     let listSql = '';
//     if (reqData.type == "purchase") {
//         listSql = purchaseTypeProductSql;
//     } else {
//         listSql = salesTypeProductSql;
//     }
//     try {
//         const [rows] = await connection.query(listSql, [reqData.id, reqData.id, reqData.id, reqData.id, reqData.id]);
//         return rows;

//     } catch (error) {
//         console.log(error);
//         throw error;
//     } finally {
//         connection.release();
//     }
// }

// reportModel.js
reportModel.getProductTimeline = async (reqData) => {
  const connection = await db.getConnection();

  /* ──────────────────────────────────────────
   * ⬇︎  SQL for the “purchase” timeline
   * ────────────────────────────────────────── */
  const purchaseTypeProductSql = `
    ( SELECT
        p.id,
        p.id                     AS product_id,
        'Product Created'        AS action,
        p.name                   AS product_name,
        NULL                     AS reference,
        p.qty                    AS quantity,
        p.price                  AS price,
        p.unit                   AS unit,
        NULL                     AS invoiceNo,
        NULL                     AS batchNo,
        p.description,
        NULL                     AS manufBy,
        p.created_on             AS action_time
      FROM product p
      WHERE p.id = ? )
    UNION ALL
    ( SELECT
        pu.id,
        pu.p_id                  AS product_id,
        'Product Purchased'      AS action,
        pr.name                  AS product_name,
        JSON_OBJECT('id', s.id, 'name', s.name) AS reference,
        pu.qty                   AS quantity,
        pu.price                 AS price,
        pu.unit                  AS unit,
        pu.invoiceNo,
        pu.b_num                 AS batchNo,
        pu.description,
        NULL                     AS manufBy,
        pu.created_on            AS action_time
      FROM purchase pu
      JOIN product  pr ON pr.id = pu.p_id
      JOIN supplier s  ON s.id = pu.s_id
      WHERE pu.p_id = ?
        AND pu.s_id = ${reqData.supId} )
    UNION ALL
    ( SELECT
        prr.id,
        prr.p_id                 AS product_id,
        'Purchase Returned'      AS action,
        p.name                   AS product_name,
        JSON_OBJECT('id', s.id, 'name', s.name) AS reference,
        prr.r_qty                AS quantity,
        prr.price                AS price,
        prr.unit                 AS unit,
        prr.invoiceNo,
        prr.b_num                AS batchNo,
        p.description,
        NULL                     AS manufBy,
        prr.created_on           AS action_time
      FROM purchase_return prr
      JOIN product  p ON p.id = prr.p_id
      JOIN supplier s ON s.id = prr.s_id
      WHERE prr.p_id = ?
        AND prr.s_id = ${reqData.supId} )

    UNION ALL

    ( SELECT
        m.id,
        m.product                AS product_id,
        'Used in Production'     AS action,
        p.name                   AS product_name,
        JSON_OBJECT('producationId', pr.id, 'operatorName', pr.operatorName) AS reference,
        m.mqty                  AS quantity,
        m.mPrice                AS price,
        p.unit                  AS unit,
        NULL                    AS invoiceNo,
        NULL                    AS batchNo,
        NULL                    AS description,
        JSON_OBJECT('id', productionPrd.id, 'name', productionPrd.name) AS manufBy,
        m.created_on            AS action_time
      FROM materials   m
      JOIN product     p   ON p.id = m.product
      JOIN production  pr  ON pr.id = m.productionId
      LEFT JOIN product productionPrd ON productionPrd.id = pr.product
      WHERE m.product = ?
        AND m.s_id   = ${reqData.supId} )

    ORDER BY action_time ASC `;

  /* ──────────────────────────────────────────
   * ⬇︎  SQL for the “sales” timeline
   * (I kept your literal 43 + batchNo=123 as-is;
   *  adjust to placeholders if needed.)
   * ────────────────────────────────────────── */
  const salesTypeProductSql = `
    ( SELECT
        p.id,
        p.id                     AS product_id,
        'Product Created'        AS action,
        p.name                   AS product_name,
        NULL                     AS reference,
        NULL                     AS batchNo,
        NULL                     AS salesName,
        p.qty                    AS quantity,
        p.price                  AS price,
        p.unit                   AS unit,
        NULL                     AS invoiceNo,
        p.description,
        p.created_on             AS action_time
      FROM product p
      WHERE p.id = ?)

    UNION ALL

    ( SELECT
        pr.id,
        pr.product               AS product_id,
        'Production Entry'       AS action,
        p.name                   AS product_name,
        JSON_OBJECT('id', pr.id, 'operatorName', pr.operatorName) AS reference,
        pr.batchNo,
        NULL                     AS salesName,
        pr.qty                   AS quantity,
        NULL                     AS price,
        pr.unit                  AS unit,
        NULL                     AS invoiceNo,
        pr.p_desc                AS description,
        pr.created_on            AS action_time
      FROM production pr
      JOIN product p ON p.id = pr.product
      LEFT JOIN customer c ON c.id = pr.c_id
      WHERE pr.product =? AND pr.batchNo ='${reqData.batchNo}' )

    UNION ALL

    ( SELECT
        s.id,
        s.p_id                  AS product_id,
        'Sales'                 AS action,
        p.name                  AS product_name,
        JSON_OBJECT('id', c.id, 'name', c.name) AS reference,
        NULL                     AS batchNo,
        s.salesName,             
        s.qty                   AS quantity,
        s.s_price               AS price,
        s.unit                  AS unit,
        s.invoiceNo,
        s.p_desc                AS description,
        s.created_on            AS action_time
      FROM sales s
      LEFT JOIN production prd ON prd.id = s.productionId
      JOIN product p ON p.id = s.p_id
      LEFT JOIN customer c ON c.id = s.c_id
      WHERE s.p_id = ?
        AND prd.batchNo ='${reqData.batchNo}' )

    UNION ALL

    ( SELECT
        sr.id,
        sr.product_id           AS product_id,
        'Sales Return'          AS action,
        p.name                  AS product_name,
        JSON_OBJECT('id', c.id, 'name', c.name) AS reference,
        NULL                     AS batchNo,
        sr.salesName,
        sr.r_qty                AS quantity,
        sr.s_price              AS price,
        sr.unit                 AS unit,
        sr.invoiceNo,
        sr.r_desc               AS description,
        sr.created_on           AS action_time
      FROM sales_return sr
      JOIN product p ON p.id = sr.product_id
      LEFT JOIN production prd ON prd.id = sr.p_id
      LEFT JOIN customer c ON c.id = sr.c_id
      WHERE sr.product_id = ?
        AND prd.batchNo ='${reqData.batchNo}' )
    ORDER BY action_time ASC`;

  /* choose query by type */
  const listSql =
    reqData.type === 'purchase'
      ? purchaseTypeProductSql
      : salesTypeProductSql;

  try {
    // one prepared-statement array works for purchase SQL (5 placeholders)
    const params = [reqData.id, reqData.id, reqData.id, reqData.id, reqData.id];
    const [rows] = await connection.query(listSql, params);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};



const purchase_stock_config = [
    { inputKey: "product", column: 'p.name', condition: conditionEnum.CONTAIN },
    { inputKey: "startDate", column: 'DATE(pr.p_date)', condition: conditionEnum.GREATER_THAN_EQUAL },//pr.p_date', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "endDate", column: 'DATE(pr.p_date)', condition: conditionEnum.LESS_THAN_EQUAL },
];
reportModel.getProductStockDetails = async (reqData) => {
    const connection = await db.getConnection();
    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    const whereCondition = filterService.generateFilterSQL(reqData, purchase_stock_config);

    const purchaseTypeProductSql = `SELECT p.id AS productId, pr.id AS purchaseId, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                                 JSON_OBJECT('id', p.id, 'name', p.name) AS product , pr.invoiceNo, pr.b_num AS batch,
     DATE_FORMAT(pr.p_date,'%d/%m/%Y') AS purchaseDate, DATE_FORMAT(pr.e_date,'%d/%m/%Y') AS purchaseExpiryDate,
      pr.unit,CAST(pr.price AS DECIMAL(10, 0)) purchaseAmount, CAST(pr.qty AS DECIMAL(10, 0)) AS purchaseQty, DATE_FORMAT(prr.created_on,'%d/%m/%Y') AS returnDate , CAST(prr.r_qty AS DECIMAL(10, 0)) returnQty, SUM(m.mqty) AS totalUseQty,
    CAST(pr.qty AS DECIMAL(10, 0)) - (IFNULL(CAST(prr.r_qty AS DECIMAL(10, 0)), 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0)) AS stockQty,
    pr.price * (pr.qty - (IFNULL(CAST(prr.r_qty AS DECIMAL(10, 0)), 0) + IFNULL(SUM(CAST(m.mqty AS DECIMAL(10, 0))), 0))) AS totalPurchaseAmount,
    JSON_ARRAYAGG( JSON_OBJECT('prodDate', DATE_FORMAT(prod.m_date, '%d/%m/%Y'), 'usedProduct', ps.name, 'operator', prod.operatorName, 'useQty', m.mqty, 'rejectQty', m.rqty)) AS usages
                                            FROM 
                                               purchase pr
                                                JOIN 
                                                    product p ON pr.p_id = p.id
                                                LEFT JOIN 
                                                    purchase_return prr ON pr.id = prr.pr_id AND pr.s_id = prr.s_id AND pr.p_id = prr.p_id
                                                JOIN 
                                                    supplier s ON pr.s_id = s.id
                                                LEFT JOIN 
                                                    materials m ON pr.id = m.purchaseId and pr.p_id = m.product AND pr.s_id = m.s_id
                                                LEFT JOIN 
                                                    production prod ON m.productionId = prod.id
                                                   left join product ps on prod.product = ps.id and ps.type ="sales"
                                                   WHERE  ${whereCondition}
                                                GROUP BY p.id, pr.id ORDER BY pr.id asc, pr.p_date asc limit ${index},${pageSize}`;
    const stockCountSql = `SELECT count(pr.id) as total  FROM 
                                               purchase pr
                                                JOIN 
                                                    product p ON pr.p_id = p.id
                                                LEFT JOIN 
                                                    purchase_return prr ON pr.id = prr.pr_id AND pr.s_id = prr.s_id AND pr.p_id = prr.p_id
                                                JOIN 
                                                    supplier s ON pr.s_id = s.id
                                                LEFT JOIN 
                                                    materials m ON pr.p_id = m.product AND pr.s_id = m.s_id
                                                LEFT JOIN 
                                                    production prod ON m.productionId = prod.id
                                                   left join product ps on prod.product = ps.id and ps.type ="sales"
                                                   WHERE  ${whereCondition}
                                                 ORDER BY  pr.p_date asc limit ${index},${pageSize}`;
    try {
        const [rows] = await connection.query(purchaseTypeProductSql);
        const [[total]] = await connection.query(stockCountSql);
        return { rows, total };
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        connection.release();
    }
}

export default reportModel;
