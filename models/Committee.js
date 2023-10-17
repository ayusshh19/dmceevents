import mongoose from 'mongoose';
const { Schema } = mongoose;


const committeSchema = new Schema({
  cname: {
    type: String,
    required: true,
  },
  coordinator: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  logo: {
    public_id: String,
    type: String, 
  },
  mission: {
    type: String,
    required: true,
  },
  gs: {
    type: String, 
    required: true,
  },
  website: {
    type: String,
    required:false
  },
});



const comit = mongoose.model('committee', committeSchema);


export default comit;