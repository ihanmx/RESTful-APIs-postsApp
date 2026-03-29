import mongoose from "mongoose";
import { Schema } from "mongoose";
import { required } from "../../client/src/util/validators";

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("User", userSchema);
