import { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Switch,
  Button,
  Spin,
  Row,
  Col
} from "antd";
import dayjs from "dayjs";
import { showNotification } from "../Constants/Toast";
import sampleForm from "../Constants/sampleForm.json"

const { TextArea } = Input;

const DynamicForm = ({ formId = "6929491fcc08796fc70e68f5", editData = null, onSuccess }) => {
  const [form] = Form.useForm();
  const [formMeta, setFormMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const formData = formMeta ? formMeta : sampleForm

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/form/${formId}`)
      .then((res) => {
        setFormMeta(res.data.data);
        setLoading(false);
        showNotification("Submissions Form Fetched Successfully", "success");
      })
      .catch(() => setLoading(false));
  }, [formId]);

  useEffect(() => {
    if (editData && editData.data) {
      const prefilled = {};
      Object.entries(editData.data).forEach(([key, value]) => {
        prefilled[key] = dayjs(value, "YYYY-MM-DD", true).isValid()
          ? dayjs(value)
          : value;
      });

      form.setFieldsValue(prefilled);
      setIsFormValid(true); 
    }
  }, [editData, form]);

  const onFormChange = (_, allValues) => {
    if (!formData) return;

    const allFilled = formData.result.fields.every((field) => {
      const value = allValues[field.id];

      if (field.type === "switch") return value === true || value === false;

      return value !== undefined && value !== null && value !== "";
    });

    setIsFormValid(allFilled);
  };

  const handleSubmit = (values) => {
    setSubmitting(true);
    setErrors({});

    const formattedData = {};
    for (const key in values) {
      formattedData[key] =
        dayjs.isDayjs(values[key]) ? values[key].format("YYYY-MM-DD") : values[key];
    }

    if (editData && editData._id) {
      axios
        .post(`http://localhost:5000/api/submission/${editData._id}/update`, {
          data: formattedData
        })
        .then(() => {
          showNotification("Submission updated successfully!", "success");
          onSuccess?.();
        })
        .catch(() => showNotification("Update failed", "error"))
        .finally(() => setSubmitting(false));

      return;
    }

    axios
      .post("http://localhost:5000/api/submission/new", {
        formId,
        data: formattedData
      })
      .then(() => {
        showNotification("Form submitted successfully!", "success");
        form.resetFields();
        setIsFormValid(false);
        setErrors({});
        onSuccess?.();
      })
      .catch((err) => {
        if (err.response?.status === 404 || err.response?.status === 400) {
          const validationErrors = err.response.data?.validationErrors || {};
          setErrors(validationErrors);

          const fieldErrors = Object.entries(validationErrors).map(([field, error]) => ({
            name: field,
            errors: [error]
          }));
          form.setFields(fieldErrors);

          showNotification("Validation failed","error");
        } else {
          showNotification("Server error occurred", "error");
        }
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!formData) return <p>Error loading form.</p>;

  const getFieldByType = (type) =>
    formData.result.fields.find((f) => f.type === type);

  const nameField = getFieldByType("text");
  const emailField = getFieldByType("email");
  const ageField = getFieldByType("number");
  const genderField = getFieldByType("select");
  const skillsField = getFieldByType("multi-select");
  const dateField = getFieldByType("date");
  const bioField = getFieldByType("textarea");
  const switchField = getFieldByType("switch");

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      onValuesChange={onFormChange} 
    >
      <p>{formData?.result?.description}</p>

      <Row gutter={16}>
        <Col span={12}>
          {nameField && (
            <Form.Item label={nameField.label} name={nameField.id}>
              <Input placeholder={nameField.placeholder} />
            </Form.Item>
          )}

          {ageField && (
            <Form.Item label={ageField.label} name={ageField.id}>
              <InputNumber style={{ width: "100%" }} placeholder={ageField.placeholder} />
            </Form.Item>
          )}

          {genderField && (
            <Form.Item label={genderField.label} name={genderField.id}>
              <Select placeholder="Select gender">
                {genderField.options.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Col>

        <Col span={12}>
          {skillsField && (
            <Form.Item label={skillsField.label} name={skillsField.id}>
              <Select mode="multiple" placeholder="Select skills" options={skillsField.options} />
            </Form.Item>
          )}

          {dateField && (
            <Form.Item label={dateField.label} name={dateField.id}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          )}

          {emailField && (
            <Form.Item label={emailField.label} name={emailField.id}>
              <Input placeholder={emailField.placeholder} />
            </Form.Item>
          )}
        </Col>
      </Row>

      {bioField && (
        <Form.Item label={bioField.label} name={bioField.id}>
          <TextArea rows={4} placeholder={bioField.placeholder} />
        </Form.Item>
      )}

      {switchField && (
        <Form.Item label={switchField.label} name={switchField.id} valuePropName="checked">
          <Switch />
        </Form.Item>
      )}

      <Button
        type="primary"
        htmlType="submit"
        loading={submitting}
        block
        disabled={!isFormValid}
      >
        {editData ? "Update Submission" : "Submit"}
      </Button>
    </Form>
  );
};

export default DynamicForm;
