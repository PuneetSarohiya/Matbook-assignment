import express from "express";
import submissionHelper from "../../common/helper/submissionHelper.js";
import { setSuccess , setServerError} from "../../common/util/responseUtil.js"
import { generatematBookId } from "../../common/util/utility.js";
import { createSubmission, getAllSubmissionsDetails } from "../../common/lib/submissionHandler/submissionHandler.js";
import formHelper from "../../common/helper/formHelper.js";
import { validateField } from "../../common/constants/responseStatus.js";

const router = express.Router();

router.post("/new", async (req, res) => {
  try {
    const matBookId = await generatematBookId();

    const submissionData = {
      formId: req.body.formId,
      data: {
        ...req.body.data,
        matBook_id: matBookId
      }
    };

    const result = await createSubmission(submissionData);

    if (result.validationErrors) {
      return res.status(404).json({
        message: "Validation failed",
        validationErrors: result.validationErrors
      });
    }

    setSuccess(res, {
      submission: result.data,
    });
  } catch (err) {
    console.error(err);
    setError(res, {
      message: "Something went wrong",
      error: err.message,
    });
  }
});

router.post('/submission-list', async (req, res) => {
  try {
    let input = { ...req.body };
    let result = await getAllSubmissionsDetails(input);
    setSuccess(res, result);
  } catch (e) {
    setServerError(res, { message: e });
  }
});

router.post("/:id/update", async (req, res) => {
  try {
    const submissionId = req.params.id;
    const updateData = req.body.data;

    const existingSubmission = await submissionHelper.getObjectById({ id: submissionId });
    const validationErrors = {};
    const form = await formHelper.getObjectById({ id: existingSubmission.formId });
    form.fields.forEach((field) => {
      if (updateData[field.id] !== undefined) {
        const errors = validateField(field, updateData[field.id]);
        if (errors.length > 0) {
          validationErrors[field.id] = errors.join(", ");
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        validationErrors,
      });
    }

    const updatedSubmission = await submissionHelper.updateObject(submissionId, {
      data: { ...existingSubmission.data, ...updateData },
    });
    setSuccess(res, { submission: updatedSubmission });
  } catch (err) {
    setError(res, { message: "Something went wrong", error: err.message });
  }
});

router.get("/:id/remove", async (req, res) => {
  try {
    const submissionId = req.params.id;

    const deletedSubmission = await submissionHelper.deleteObjectById(submissionId);
    setSuccess(res, { message: "Submission deleted successfully", submission: deletedSubmission });
  } catch (err) {
    setError(res, { message: "Something went wrong", error: err.message });
  }
});


export default router;
