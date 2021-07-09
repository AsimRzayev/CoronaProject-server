import { Request, Response, NextFunction } from "express";
const validation =
    (schema: any) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        try {
            await schema.validate(body);
            return next();
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

module.exports = validation;
