import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const reportModel = {};
const conditionEnum = filterService.condition;


const sales_config = [
    { inputKey: "cId", column: 'c.id', condition: conditionEnum.EQ },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 's.s_date', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "to", column: 's.s_date', condition: conditionEnum.LESS_THAN_EQUAL },
];

reportModel.getSalesOverview = async (reqData) => {
    const connection = await db.getConnection();
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, sales_config);
        const whereClause = whereCondition ? `  ${whereCondition}` : `s.s_date >= CURDATE() - INTERVAL 30 DAY`;
        const listSql = `SELECT  s.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
        JSON_OBJECT('id', p.id, 'name', p.product) AS product,
        s.qty, 
        s.s_price AS price, 
        s.unit, 
        DATE_FORMAT(s.s_date, '%Y/%m/%d') AS date,
                            sum(s.qty) totalQty,
                            sum(s.s_price) totalPrice
                        FROM sales s
                        LEFT JOIN customer c ON c.id = s.c_id
                        LEFT JOIN production p ON p.id = s.p_id
                        WHERE  ${whereClause} 
                        GROUP BY s.id, c.name, p.product, s.unit, s.s_date
                        ORDER BY s.id DESC`;
        const totalSql = `SELECT SUM(s.qty) AS totalQty, SUM(s.s_price) AS totalPrice 
                        FROM sales s
                        LEFT JOIN customer c ON c.id = s.c_id
                        LEFT JOIN production p ON p.id = s.p_id
                        where  ${whereClause}`;

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
    { inputKey: "cId", column: 'c.id', condition: conditionEnum.EQ },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 's.created_on', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "to", column: 's.created_on', condition: conditionEnum.LESS_THAN_EQUAL },
];
reportModel.getSalesReturnOverview = async (reqData) => {
    const connection = await db.getConnection();
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, sales_return_config);
        const whereClause = whereCondition ? `  ${whereCondition}` : `s.created_on >= CURDATE() - INTERVAL 30 DAY`;
        const listSql = `SELECT  s.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                            JSON_OBJECT('id', p.id, 'name', p.product) AS product,
                            s.r_qty qty, 
                            s.s_price AS price, 
                            s.unit, 
                            DATE_FORMAT(s.created_on, '%Y/%m/%d') AS date,
                            sum(s.r_qty) totalQty,
                            sum(s.s_price) totalPrice
                        FROM sales_return s
                            LEFT JOIN customer c ON c.id = s.c_id
                            LEFT JOIN production p ON p.id = s.p_id
                           WHERE  ${whereClause} 
                            GROUP BY s.id, c.name, p.product, s.unit, s.created_on
                            ORDER BY s.id DESC`;
        const totalSql = `SELECT SUM(s.r_qty) AS totalQty, SUM(s.s_price) AS totalPrice 
                                FROM sales_return s
                                 LEFT JOIN customer c ON c.id = s.c_id
                                 LEFT JOIN production p ON p.id = s.p_id
                                WHERE  ${whereClause}`;

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
    { inputKey: "sId", column: 's.id', condition: conditionEnum.EQ },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 'pr.p_date', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "to", column: 'pr.p_date', condition: conditionEnum.LESS_THAN_EQUAL },
];

reportModel.getPurchaseReports = async (reqData) => {
    const connection = await db.getConnection();
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, purchase_config);
        const whereClause = whereCondition ? `  ${whereCondition}` : `pr.p_date >= CURDATE() - INTERVAL 30 DAY`;
        const listSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber,   JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                                 JSON_OBJECT('id', pr.id, 'name', pr.product) AS product, 
                                 pr.qty, pr.price, pr.unit, pr.status, 
                                 DATE_FORMAT(pr.p_date, '%Y-%m-%d') AS date
                        FROM purchase pr
                                LEFT JOIN supplier s ON pr.s_id = s.id
                               WHERE  ${whereClause} 
                                GROUP BY pr.id, s.name, pr.product, pr.unit, pr.p_date
                                ORDER BY pr.id DESC`;
        const totalSql = `SELECT SUM(pr.qty) AS totalQty, SUM(pr.price) AS totalPrice 
                                FROM purchase pr
                                  LEFT JOIN supplier s ON pr.s_id = s.id
                                 WHERE ${whereClause}`;
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
    { inputKey: "sId", column: 's.id', condition: conditionEnum.EQ },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 'pr.created_on', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "to", column: 'pr.created_on', condition: conditionEnum.LESS_THAN_EQUAL },
];
reportModel.getPurchaseReturnReports = async (reqData) => {
    const connection = await db.getConnection();
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, purchase_return_config);
        const whereClause = whereCondition ? `  ${whereCondition}` : `pr.created_on >= CURDATE() - INTERVAL 30 DAY`;
        const listSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber,   JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                                 JSON_OBJECT('id', pr.id, 'name', pr.product) AS product, 
                                 pr.r_qty qty, pr.price, pr.unit, 
                                 DATE_FORMAT(pr.created_on, '%Y-%m-%d') AS date
                        FROM purchase_return pr
                                LEFT JOIN supplier s ON pr.s_id = s.id
                                where  ${whereClause} 
                                GROUP BY pr.id, s.name, pr.product, pr.unit, pr.created_on
                                ORDER BY pr.id DESC`;
        const totalSql = `SELECT SUM(pr.r_qty) AS totalQty, SUM(pr.price) AS totalPrice 
                                FROM purchase_return pr
                                  LEFT JOIN supplier s ON pr.s_id = s.id
                                WHERE  ${whereClause}`;
        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}


const stock_config = [
    { inputKey: "pId", column: 'prch.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 'prch.p_date', condition: conditionEnum.GREATER_THAN_EQUAL },
    { inputKey: "to", column: 'prch.p_date', condition: conditionEnum.LESS_THAN_EQUAL },
];

reportModel.getStockReports = async (reqData) => {
    const connection = await db.getConnection();
    try {
        const whereCondition = filterService.generateFilterSQL(reqData, stock_config);
        const whereClause = whereCondition ? ` ${whereCondition}` : ` prch.p_date >= CURDATE() - INTERVAL 30 DAY`;
        const listSql = `SELECT 
                                prch.id,
                                 DATE_FORMAT(MAX(prch.p_date), '%Y-%m-%d') AS purchaseDate,
                                prch.product,
                                prch.b_num AS pBatchNo,
                                prch.qty AS pQty,
                                prch.price AS pRate,
                                DATE_FORMAT(MAX(m.created_on), '%Y-%m-%d') AS mDate,
                                IFNULL(SUM(m.mqty), 0) - IFNULL(SUM(m.rqty), 0) AS mQty,
                                IFNULL(SUM(m.rqty), 0) AS rQty,
                                prch.qty - (IFNULL(SUM(m.mqty), 0) - IFNULL(SUM(m.rqty), 0)) AS balanceQty
                            FROM 
                                purchase prch
                            LEFT JOIN 
                                materials m ON prch.id = m.product
                            WHERE  
                                ${whereClause}
                            GROUP BY 
                                prch.id, prch.p_date, prch.product, prch.b_num, prch.qty, prch.price
                            ORDER BY 
                                prch.p_date`;
        const [rows] = await connection.query(listSql);
        return { rows };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

export default reportModel;
