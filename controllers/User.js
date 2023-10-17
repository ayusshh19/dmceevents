import User from "../models/User.js";
import cloudinary from "cloudinary";
import fs from "fs";
import bcrypt from "bcrypt";
export const register = async (req, res) => {
    try {
      const { name, email, password ,mobileNo,role} = req.body;
        // console.log(req)
      const profileImage = req.files.profileImage.tempFilePath;
      console.log(profileImage);
  
      let user = await User.findOne({ email });
  
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
  
  
      const mycloud = await cloudinary.v2.uploader.upload(profileImage);
  
      fs.rmSync("./tmp", { recursive: true });
  
      user = await User.create({
        name,
        email,
        password,
        profileImage: JSON.stringify({
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        }),
        mobileNo,
        role
      });
  
      user.save()
    return res.status(200).json({ success: true, message:user})
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const login = async (req, res) => {
  console.log(req.body)
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter all fields" });
      }
  
      const user = await User.findOne({ email }).select("+password");
  
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email or Password" });
      }
  
      const isMatch = await bcrypt.compare(password,user.password);
                
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email or Password" });
      }
  
      return res
          .status(200)
          .json({ success: true, message: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  