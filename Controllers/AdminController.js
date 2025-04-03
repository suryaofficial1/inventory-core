import adminModel from "../Models/AdminModel.js";
import { singleFileUploader } from "../service/singleUploader.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

import bcrypt from "bcrypt";
import { sendEmail } from "../utils/SendEmail.js";
import logger from "../core/app-loger.js";



const adminController = {};

adminController.upsertUser = async (req, res, next) => {
    try {
        // Configure file upload
        const upload = singleFileUploader(
            process.env.USER_IMAGE,
            `user`,
            "profile",
            1024 * 1024 * 10 // Max file size: 10MB
        );

        // Handle file upload and process the form data
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                logger.error('Error in upload profile photo- ', err);
                return res.status(500).json({ message: 'File upload failed', error: err });
            }

            // Validate required fields
            // const { body } = req;
            const { name, role, department, mobile, email, password, status } = req.body;
            validationService.validateRequired({ name, role, department, mobile, email, status }, ['name', 'role', 'department', 'mobile', 'email', 'status']);
            if (!req.params.id && !password) {
                console.log(" password not found")
                logger.info(" password not found")
                validationService.validateRequired({ password }, ['password']);
            }

            if (!req.params.id) {
                const isExitUser = await adminModel.getUserByEmail(email);
                if (isExitUser) {
                    return res.send(getErrorObject(409, 'User already exists'));
                }
            }

            // Prepare the request body for database insertion
            let fileName;
            if (req.params.id && typeof req.body.profile === 'string') {
                // Update existing category without uploading a new image
                fileName = req.body.profile;
            } else {
                // Upload new image
                fileName = "/" + process.env.USER_IMAGE.split('/').pop() + '/' + req.file?.filename
            }

            const reqBody = {
                name: name,
                email: email,
                mobile: mobile,
                roleId: role,
                depId: department,
                status: status,
                profile: fileName || '',
                password: password ? await bcrypt.hash(password, 10) : null,
                id: req.params.id ? req.params.id : null
            };
            await adminModel.upsertUser(reqBody);
            return res.send(getSuccessObject());
        });
    } catch (err) {
        next()
    }
};



adminController.sendOtp = async (req, res) => {
    try {
        validationService.validateRequired(req.body, ['email']);
        
        const user = await adminModel.getUserByEmail(req.body.email);
        if (!user.length) {
            return res.send(getErrorObject(404, 'User not found'));
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const send = await sendEmail(req.body.email, otp);
        if (send == true) {
            const reqObj = {
                id: user[0].id,
                email: user[0].email,
                otp: otp,
                status: 0,
                contact: user[0].email,
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            }
            await adminModel.sendOtp(reqObj);
            return res.send(getSuccessObject("OTP sent successfully"));
        }

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}

adminController.getUsers = async (req, res) => {
    try {
        validationService.validateRequired(req.query, ['page', 'per_page']);
        
        const result = await adminModel.getUsers(req.query);
        
        return res.send(getSuccessObject(result));

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}

adminController.deleteUser = async (req, res) => {
    try {
        validationService.validateRequired(req.params, ['id']);
        
        const result = await adminModel.deleteUser(req.params.id);
        return res.send(getSuccessObject(result));

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}

adminController.getRoles = async (req, res) => {
    try {
        const result = await adminModel.getRoles(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}

adminController.getDepartments = async (req, res) => {
    try {
        const result = await adminModel.getDepartments(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}



export default adminController;