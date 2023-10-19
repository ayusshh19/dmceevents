import event from "../models/Events.js";
import cloudinary from "cloudinary";
import fs from "fs";

async function checkEventCollision(location, date, start, end) {

    const collidingEvent = await event.findOne({
        location,
        date,
        $or: [
            {
                $and: [
                    { start: { $lt: end } },
                    { end: { $gt: start } },
                ],
            },
            {
                $and: [
                    { start: { $gte: start } },
                    { end: { $lte: end } },
                ],
            },
        ],
    });

    return collidingEvent;
}


export const addevent = async (req, res) => {
    // try {
        const { eventname, committee, start, end, location, about, date } = req.body;
        console.log(req.body)
        const poster = req.files.poster.tempFilePath;
        console.log(poster);

        let user = await event.findOne({ eventname: eventname, start: start, location: location });

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "Event already added!" });
        }

        const isAvailable = await checkEventCollision(location, date, start, end);

        if (isAvailable) {
            return res.status(400).json({ success: false, message: 'Location is already allocated for the specified time period.' });
        }
        const mycloud = await cloudinary.v2.uploader.upload(poster);

        fs.rmSync("./tmp", { recursive: true });

        user = await event.create({
            eventname,
            committee,
            poster: JSON.stringify({
                public_id: mycloud.public_id,
                url: mycloud.secure_url,
            }),
            start,
            end,
            location,
            about,
            date
        });

        user.save()
        return res.status(200).json({ success: true, message: user })
    // } catch (error) {
    //     res.status(500).json({ success: false, message: error.message });
    // }
};

export const getevnt = async (req, res) => {
    try {
        const events = await event.find();

       return  res.status(200).json({ success: true, data: events });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const approvedby = async (req, res) => {
    console.log(req.body)
    const eventId=req.body.eventId;
    const roles=req.body.roles;
    // try {
        const event1 = await event.findById(eventId);
        if (!event1) {
            return  res.status(400).json({ success: false, data: "event not found!" });
        }
        // Check if idToAdd is not already in the approvedb array
        if (!event.approvedb.includes(roles)) {
          event.approvedb.push(roles);
          await event.save();
          return  res.status(200).json({ success: true, data: "successfull" });
        } else {
            return  res.status(400).json({ success: false, data: "something went wrong" });
        }
    //   } catch (error) {
    //     return  res.status(500).json({ success: true, data: error.message });
    //   }
}


export const updateevent = async (req, res) => {
    console.log(req.body._id)
    console.log(req.body)
    try {
        const updatedcommittee = await event.findByIdAndUpdate(req.body._id, req.body, {
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

export const deleteevent = async (req, res) => {
    try {
        const deletedCommittee = await event.findOneAndDelete({ _id: req.body._id });

        if (!deletedCommittee) {
            return res.status(200).json({ success: false, message: 'Committee not found or already deleted' });
        }

        return res.status(200).json({ success: true, deleted: deletedCommittee });
    } catch (error) {
        return res.status(200).json({ success: false, message: error.message });
    }
};