import express  from "express";
import handleNewUser from "../controllers/registerControler";
const registerRouter = express.Router();

registerRouter.post('/',handleNewUser);
 
export default registerRouter;