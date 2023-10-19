import mongoose from 'mongoose';
const { Schema } = mongoose;


const eventSchema = new Schema({
    eventname: {
      type: String,
      required: true,
    },
    committee: {
      type: String,
      required: true,
    },
    poster: {
      public_id: String,
      type: String,
    },
    start: {
      type: Date, 
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    approvedb:{
      type:[String],
      required: false,
      default:[]
    }
  });


const event = mongoose.model('event', eventSchema);


export default event;