import comit from "../models/Committee.js";
import cloudinary from "cloudinary";
import fs from "fs";
export const addcommittee = async (req, res) => {
  try {
    const { cname, coordinator, department, mission, gs, website } = req.body;
    // console.log(req)
    const logo = req.files.logo.tempFilePath;
    console.log(logo);

    let user = await comit.findOne({ cname: cname, department: department });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Committee already exists" });
    }


    const mycloud = await cloudinary.v2.uploader.upload(logo);

    fs.rmSync("./tmp", { recursive: true });

    user = await comit.create({
      cname,
      coordinator,
      department,
      logo: JSON.stringify({
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      }),
      mission,
      gs,
      website
    });

    user.save()
    return res.status(200).json({ success: true, message: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getcommittee = async (req, res) => {
  try {
    const committees = await comit.find();

    res.status(200).json({ success: true, data: committees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const updateCommittee = async (req, res) => {
  console.log(req.body._id)
  console.log(req.body)
  try {
    const updatedcommittee = await comit.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    console.log(updatedcommittee)
    if (!updatedcommittee) {
      return res.status(200).json({ success: false, message: 'Committee not found or update failed' });
    }

    return res.status(200).json({ success: true, newdata: updatedcommittee });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

export const deleteCommittee = async (req, res) => {
  try {
    const deletedCommittee = await comit.findOneAndDelete({ _id: req.body._id });

    if (!deletedCommittee) {
      return res.status(200).json({ success: false, message: 'Committee not found or already deleted' });
    }

    return res.status(200).json({ success: true, deleted: deletedCommittee });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};