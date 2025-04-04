import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Link to user
    ownername: { type: String, required: true, unique: true },
    contact: {
        type: String,
        required:true,unique:true
    },
    slot_no:{
        type: String, required:true,unique:true
    },
    vehicle_no:{
        type: String, required:true,unique:true
    },
    date:{
        type: String, required:true,unique:true
    },
    time:{
        type: String, required:true,unique:true
    },

});



const slotBooking = mongoose.model('slotBooking', userSchema);
export default slotBooking;