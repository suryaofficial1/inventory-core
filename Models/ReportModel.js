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
        const whereClause = whereCondition ? ` WHERE ${whereCondition}` : '';
        const listSql = `SELECT  s.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                            JSON_OBJECT('id', p.id, 'name', p.name) AS product,
                            s.qty, 
                            s.s_price AS price, 
                            s.unit, 
                            DATE_FORMAT(s.s_date, '%Y/%m/%d') AS date,
                            sum(s.qty) totalQty,
                            sum(s.s_price) totalPrice
                        FROM sales s
                            LEFT JOIN customer c ON c.id = s.c_id
                            LEFT JOIN product p ON p.id = s.p_id
                            ${whereClause} 
                            GROUP BY s.id, c.name, p.name, s.unit, s.s_date
                            ORDER BY s.id DESC`;
        const totalSql = `SELECT SUM(s.qty) AS totalQty, SUM(s.s_price) AS totalPrice 
                                FROM sales s
                                 LEFT JOIN customer c ON c.id = s.c_id
                                 LEFT JOIN product p ON p.id = s.p_id
                                 ${whereClause}`;

        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        console.error("Error fetching sales overview:", error);
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
        const whereClause = whereCondition ? ` WHERE ${whereCondition}` : '';
        const listSql = `SELECT pr.id, pr.invoiceNo, pr.b_num bNumber,   JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                                 JSON_OBJECT('id', p.id, 'name', p.name) AS product, 
                                 p.qty, p.price, p.unit, p.status, 
                                 DATE_FORMAT(pr.p_date, '%Y/%m/%d') AS date
                        FROM purchase pr
                                LEFT JOIN supplier s ON pr.s_id = s.id
                                LEFT JOIN product p ON pr.p_id = p.id
                                ${whereClause} 
                                GROUP BY pr.id, s.name, p.name, pr.unit, pr.p_date
                                ORDER BY pr.id DESC`;
        const totalSql = `SELECT SUM(pr.qty) AS totalQty, SUM(pr.price) AS totalPrice 
                                FROM purchase pr
                                  LEFT JOIN supplier s ON pr.s_id = s.id
                                LEFT JOIN product p ON pr.p_id = p.id
                                 ${whereClause}`;
        const [rows] = await connection.query(listSql);
        const [[total]] = await connection.query(totalSql);
        return { rows, total };
    } catch (error) {
        console.error("Error fetching sales overview:", error);
        throw error;
    } finally {
        connection.release();
    }
}


export default reportModel;
