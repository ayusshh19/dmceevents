import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  profileImage: {
    public_id: String,
    type: String, 
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  role: {
    type: String, 
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
    if(!this.isModified("password"))return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});


const User = mongoose.model('User', userSchema);


export default User;