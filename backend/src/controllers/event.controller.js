const crypto = require("crypto");
const Event = require("../models/Event");
const Organizer = require("../models/Organizer");




exports.createEvent = async (req,res)=>{
 try{
  if(req.user.role!=="organizer")
    return res.status(403).json({message:"Only organizers allowed"});

  const {
    title,description,sport,category,date,venue,locationUrl,
    capacity,fee,eventType,teamSize,
    firstPrize,secondPrize,thirdPrize,
    contactName,contactNumber,certificateEnabled
  } = req.body;

  if(!req.file) return res.status(400).json({message:"Banner required"});

  const event = await Event.create({
    title,description,sport,category,date,venue,locationUrl,
    banner:req.file.path,
    organizer:req.user._id,

    eventType,
    teamSize: eventType==="team" ? teamSize : 1,

    capacity,
    fee,

    prizeDetails:{
      first:firstPrize,
      second:secondPrize || null,
      third:thirdPrize || null,
    },

    contactName,
    contactNumber,
    certificateEnabled: certificateEnabled==="true",
  });

  res.status(201).json(event);
 }
 catch(err){
  console.error("CREATE EVENT ERROR:",err);
  res.status(500).json({message:"Create failed"});
 }
};

exports.getAllEvents = async (_req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  // console.log(events);
  res.json(events);

};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).lean();
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event); // MUST return JSON
  } catch (err) {
    console.error("Fetch event error:", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};


exports.toggleRegistration = async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  event.registrationsClosed = !event.registrationsClosed;
  await event.save();

  res.json({
    message: event.registrationsClosed
      ? "Registrations closed"
      : "Registrations opened",
    registrationsClosed: event.registrationsClosed,
  });
};

exports.deleteEvent = async (req, res) => {
  await Event.findOneAndDelete({
    _id: req.params.id,
    organizer: req.user._id,
  });
  res.json({ success: true });
};



