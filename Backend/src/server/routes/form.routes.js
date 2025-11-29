import express from "express";
import { 
  setSuccess, 
  setServerError, 
} from "../../common/util/responseUtil.js";

import formHelper from "../../common/helper/formHelper.js";

const router = express.Router();

router.post("/new", async (req, res) => {
  try {
    const result = await formHelper.addObject(req.body);
    return setSuccess(res, result.data);
  } catch (err) {
    return setServerError(res, err.message || err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await formHelper.getObjectById({ id: req.params.id });
    return setSuccess(res, { result });
  } catch (err) {
    return setServerError(res, err.message || err);
  }
});

export default router;
