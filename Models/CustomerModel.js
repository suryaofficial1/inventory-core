import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const customerModel = {};
const conditionEnum = filterService.condition;

customerModel.upsertCustomer = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `update customer set name = ?, v_code = ?,  address = ?, location = ?, contact = ?, gstin = ?, status = ? where id = ?`;
    const insertSql = `insert into customer (name, v_code, address, location, contact, gstin, status, created_on) values (?,?,?,?,?,?,?,now())`;
    try {
        if (body.id) {
            await connection.query(updateSql, [body.name, body.vCode, body.address, body.location, body.contact, body.gstin, body.status, body.id]);
            return true;
        }
        else {
            await connection.query(insertSql, [body.name, body.vCode, body.address, body.location, body.contact, body.gstin, body.status]);
            return true
        }
    } finally {
        connection.release();
    }
};

const customer_config = [
    { inputKey: "name", column: 'name', condition: conditionEnum.EQ },
]

customerModel.getCustomers = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, customer_config);
    let finalFilter = filter ? ` where ${filter} ` : '';
    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;

    try {
        const countSql = `select count(*) as total from customer  ${finalFilter}`
        const listSql = `select id, name, v_code vCode, address, location, contact, gstin, status from customer  ${finalFilter} ORDER BY id DESC limit ${index},${pageSize}`

        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

    } finally {
        connection.release();
    }
};

customerModel.deleteCustomer = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `delete from customer where id = ?`
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


export default customerModel;