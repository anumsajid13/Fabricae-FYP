const mongoose = require("mongoose");

const threeDMockupSchema = new mongoose.Schema({

  pattern: {
    type: String,
  },
  mockupName:{
    type: String,
    required:true,
  },
  garmentType: {
    type: String,
    required: true,
  },
  embellishments: {
    type: Boolean,
    default: false,
  },
  exportOptions: {
    format: {
      type: String,
      enum: ['PNG', 'OBJ'],
    },
    watermarked: {
      type: Boolean,
      default: false,
    },
  },
  glbUrl: {
    type: String, 
    required: true,
  },
  images: {
    type: [String], 
    default: [], 
  },
});

module.exports = mongoose.model("ThreeDMockup", threeDMockupSchema);
