import { INTERNAL_SERVER_ERROR, NOT_FOUND, PERMISSION_DENIED, STATUS_SUCCESS_OK, TEMPORARY_REDIRECT } from "../constants/responseStatus.js";

export function setSuccess(res, data) {
    res.status(STATUS_SUCCESS_OK);
    res.json({ status: 'Success', data });
}

export function setServerError(res, data) {
    res.status(INTERNAL_SERVER_ERROR);
    res.json({ status: 'Error', data });
}

export function setServerRedirect(res, data) {
    res.status(TEMPORARY_REDIRECT);
    res.json({ status: 'Error', data });
}

export function setNotFoundError(res, data) {
    res.status(NOT_FOUND);
    res.json({ status: 'Error', data });
}

export function createResponseSetter(moduleName) {
    return function setResponse(req, res, err, model) {
        if (err) {
            setServerError(res, { message : err });
        } else {
            const module = model[moduleName];
            if (module) {
                let response = {};
                response[`${moduleName}`] = module;
                setSuccess(res, response);
            } else {
                setNotFoundError(res, `${moduleName}: ${req.params.id} not found`);
            }
        }
    };
}

export function setPermissionError(res) {
    res.status(PERMISSION_DENIED);
    res.json({ status: 'Permission Denied', data: "You have not enough permission" });
}