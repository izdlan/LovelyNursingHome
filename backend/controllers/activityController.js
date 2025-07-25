const activityDao = require('../dao/activityDao');
const { sendEmail } = require('../services/emailNotifier');
const Volunteer = require('../models/Volunteer');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

exports.addActivity = async (req, res) => {
  try {
    const { title, description, date, time, slots } = req.body;
    const image = '/uploads/' + req.file.filename;
    await activityDao.createActivity({ title, description, date, time, slots, image });

    // Send email to all approved volunteers
    const approvedVolunteers = await Volunteer.find({ status: 'approved' });
    const activityDate = new Date(date).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' });
    const activityTime = time ? time : 'TBD';
    const subject = `New Volunteer Activity: ${title}`;
    const emailBody = `Dear Volunteer,\n\nA new volunteer activity has been added!\n\nTitle: ${title}\nDate: ${activityDate}\nTime: ${activityTime}\nSlots: ${slots}\n\nDescription:\n${description}\n\nPlease log in to your account to view and book this activity.\n\nThank you for your support!\nLovely Nursing Home`;
    for (const vol of approvedVolunteers) {
      if (vol.email) {
        try {
          await sendEmail(vol.email, subject, emailBody);
        } catch (err) {
          console.error('Failed to send activity email to', vol.email, err);
        }
      }
    }

    res.redirect('/confirmation.html?title=Activity+Added!&text=All+approved+volunteers+have+been+notified+by+email.&btn=Add+Another+Activity&href=%2Fadmin%2Fadd_activity.html');
  } catch (err) {
    res.status(500).send('Error saving activity: ' + err.message);
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await activityDao.getActivityById(id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching activity', error: err.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedActivity = await activityDao.updateActivity(id, updateData);
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity updated successfully', activity: updatedActivity });
  } catch (err) {
    res.status(500).json({ message: 'Error updating activity', error: err.message });
  }
};

exports.updateActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedActivity = await activityDao.updateActivityStatus(id, status);
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: `Activity status updated to ${status}`, activity: updatedActivity });
  } catch (err) {
    res.status(500).json({ message: 'Error updating activity status', error: err.message });
  }
};

exports.getAdminActivities = async (req, res) => {
  try {
    const activities = await activityDao.getAllActivities();
    res.json(activities);
  } catch (err) {
    res.status(500).send('Error fetching activities');
  }
};

exports.getVolunteerActivities = async (req, res) => {
  try {
    const activities = await activityDao.getAllActivities({ status: 'active' });
    res.json(activities);
  } catch (err) {
    res.status(500).send('Error fetching activities');
  }
};

exports.bookActivity = async (req, res) => {
  try {
    const volunteerId = req.session.volunteer && req.session.volunteer._id;
    if (!volunteerId) return res.status(401).send('Not logged in');
    const { activityId } = req.body;
    const booking = await activityDao.bookActivity(activityId, volunteerId);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(400).send('Booking failed: ' + err.message);
  }
};

exports.getBookingsForActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const bookings = await activityDao.getBookingsForActivity(activityId);
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Error fetching bookings');
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).send('Invalid status');
    const booking = await activityDao.updateBookingStatus(bookingId, status);
    // Send email if status changed
    if (booking && booking.volunteer && booking.volunteer.email) {
      const subject = `Your booking has been ${status}`;
      const text = `Hi ${booking.volunteer.fullName || ''},\n\nYour booking for the activity has been ${status} by the admin.`;
      console.log('Attempting to send email to:', booking.volunteer.email, 'Subject:', subject, 'Text:', text);
      try {
        await sendEmail(booking.volunteer.email, subject, text);
        console.log('Email sent successfully!');
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr);
      }
    }
    res.json(booking);
  } catch (err) {
    res.status(500).send('Error updating booking status');
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const volunteerId = req.session.volunteer && req.session.volunteer._id;
    if (!volunteerId) return res.status(401).send('Not logged in');
    const bookings = await activityDao.getBookingsForVolunteer(volunteerId);
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Error fetching your bookings');
  }
};

exports.getVolunteerCalendar = async (req, res) => {
  try {
    const volunteerId = req.session.volunteer && req.session.volunteer._id;
    if (!volunteerId) return res.status(401).json({ error: 'Not logged in' });

    const { month, year } = req.query;

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

      const bookings = await mongoose.model('Booking').aggregate([
        { $match: { volunteer: new mongoose.Types.ObjectId(volunteerId) } },
        {
          $lookup: {
            from: 'activities',
            localField: 'activity',
            foreignField: '_id',
            as: 'activity'
          }
        },
        { $unwind: '$activity' },
        {
          $match: {
            'activity.date': { $gte: startDate, $lte: endDate }
          }
        },
        { $sort: { 'activity.date': 1, 'activity.time': 1 } }
      ]);
      res.json(bookings);
    } else {
      // fallback: get all bookings for the volunteer
      const bookings = await mongoose.model('Booking').find({ volunteer: volunteerId })
        .populate('activity', 'title date time description image')
        .sort({ 'activity.date': 1, 'activity.time': 1 });
      res.json(bookings);
    }
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).json({ error: 'Error fetching calendar data: ' + err.message });
  }
};