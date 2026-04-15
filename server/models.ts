import mongoose from 'mongoose';

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  department: String,
  avatar: String,
});

export const User = mongoose.model('User', userSchema);

// Course Model
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  credits: { type: Number, required: true },
});

export const Course = mongoose.model('Course', courseSchema);

// ClassSession Model
const classSessionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true },
  dayOfWeek: { type: Number, required: true }, // 0-6
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  type: { type: String, enum: ['lecture', 'lab', 'tutorial'], required: true },
});

export const ClassSession = mongoose.model('ClassSession', classSessionSchema);

// Appointment Model
const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  type: { type: String, enum: ['virtual', 'in-person'], required: true },
  topic: { type: String, required: true },
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
