import { validateField } from "../../constants/responseStatus.js";
import formHelper from "../../helper/formHelper.js";
import submissionHelper from "../../helper/submissionHelper.js";

export async function createSubmission(payload) {
    const { formId, data } = payload;
  
    const form = await formHelper.getObjectById({ id: formId });
    if (!form) return { error: "Form not found" };
  
    const validationErrors = {};
  
    form.fields.forEach((field) => {
      const value = data[field.id];
      const errors = validateField(field, value);
      if (errors.length > 0) {
        validationErrors[field.id] = errors.join(", ");
      }
    });
  
    if (Object.keys(validationErrors).length > 0) {
      return { validationErrors };
    }
  
    const submission = await submissionHelper.addObject({
      formId,
      data,
    });
  
    return { data: submission };
  }
  
  function getAllSubmissionsQuery(inputFilters) {
    let query = {};
    let sort = {};
  
    if (inputFilters && inputFilters.qtext) {
      query.$or = [
        { "data.fullName": { $regex: inputFilters.qtext, $options: "i" } },
        { "data.matBook_id": { $regex: inputFilters.qtext, $options: "i" } }
      ];
    }
  
    return { query, sort };
  }
  

export async function getAllSubmissionsDetails(input) {
    try {
        let model = {};
        let filters = {};
        let inputFilters = input.filter || {};

        const submissionQuery = getAllSubmissionsQuery(inputFilters);
        
        filters.pageNum = inputFilters.pageNum || 1;
        filters.pageSize = inputFilters.pageSize || 50;
        filters.query = submissionQuery.query;

        model.submissionList = await submissionHelper.getAllObjects(filters);
        model.total = await submissionHelper.getAllObjectCount({ query: filters.query });
        model.totalPages = Math.ceil(model.total / filters.pageSize); 

        return model;
    } catch (e) {
        throw e;
    }
}