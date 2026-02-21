const Organizer = require("../models/Organizer");
const User = require("../models/User");
const crypto = require("crypto");

exports.requestOrganizer = async (req, res) => {

  const exists = await Organizer.findOne({ user: req.user._id });
  if (exists) return res.status(409).json({ message: "Already requested" });

  if (!req.files?.photo || !req.files?.idProof)
    return res.status(400).json({ message: "Files missing" });

  await Organizer.create({
    user: req.user._id,
    organizationName: req.body.organizationName,
    description: req.body.description,
    photo: req.files.photo[0].path,
    idProof: req.files.idProof[0].path,
    status: "pending",
    walletAddress: null

  });

  await User.findByIdAndUpdate(req.user._id, {
    organizerRequest: "pending"
  });

  res.json({ success: true });
};





exports.getPendingOrganizers = async (req, res) => {
  const pending = await Organizer.find({ status: "pending" }).populate("user","email");
  const approved = await Organizer.find({ status: "approved" }).populate("user","email");
  res.json({ pending, approved });
};



exports.approveOrganizer = async (req, res) => {
  const org = await Organizer.findById(req.params.id).populate("user");

  org.status = "approved";
  

  await org.save();

  await User.findByIdAndUpdate(org.user._id,{
    role:"organizer",
    organizerRequest:"approved"
  });

  res.json({success:true});
};



exports.rejectOrganizer = async (req, res) => {
  const organizer = await Organizer.findById(req.params.id);

  if (!organizer)
    return res.status(404).json({ message: "Organizer not found" });

  // delete organizer record
  await Organizer.findByIdAndDelete(req.params.id);

  // update linked user
  await User.findByIdAndUpdate(organizer.user, {
    organizerRequest: "rejected",
    role: "participant",
    isOrganizerVerified: false,
  });

  res.json({ success: true });
};


exports.cancelOrganizerRequest = async (req, res) => {
  await Organizer.deleteOne({ user: req.user._id });
  await User.findByIdAndUpdate(req.user._id, { organizerRequest: "none" });
  res.json({ success: true });
};


exports.getMyOrganizerRequest = async (req, res) => {
  const org = await Organizer.findOne({ user: req.user._id });
  res.json(org || null);
};


