import Submission from "../models/Submission.js";

export async function generatematBookId(){
    const prefix = "MAT";
    let randomDigits = Math.floor(Math.random() * (999999999 - 10000000 + 1)) + 10000000;
    let matBookId = prefix + randomDigits;
  
    const existingMatBookID = await Submission.findOne({ matBook_id: matBookId });
    if (existingMatBookID) {
      return generatematBookId();
    }
  
    return matBookId;
  };
  