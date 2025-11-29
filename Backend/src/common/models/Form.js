import mongoose from "mongoose";
const { Schema } = mongoose;

const OptionSchema = new Schema({
  label: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const ValidationSchema = new Schema({
  minLength: Number,
  maxLength: Number,
  regex: String,

  min: Number,
  max: Number,

  minDate: String,
  maxDate: String,

  minSelected: Number,
  maxSelected: Number
}, { _id: false });

const FieldSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },

  type: {
    type: String,
    required: true,
    enum: [
      "text",
      "number",
      "select",
      "multi-select",
      "date",
      "textarea",
      "switch"
    ]
  },

  options: [OptionSchema],
  validation: ValidationSchema
});

const FormSchema = new Schema({
  formId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  submitText: { type: String, default: "Submit" },

  fields: { type: [FieldSchema], required: true }
}, { timestamps: true });

export default mongoose.model("Form", FormSchema);
