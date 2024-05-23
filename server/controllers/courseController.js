const CourseModel = require("../model/CourseModel");
const cloudinary=require('../middlewares/cloudinary');
const { requireLogin } = require("../middlewares/requireLogin");
const LectureModel = require("../model/Lectures");

module.exports.postCourse__controller = async (req, res, next) => {
  try {
    console.log(req.body); // Log the request body to see what data is being sent

    const { courseDescription, courseName, courseLink, coursePrice, lectures } = req.body;

    if (!courseDescription || !courseName || !courseLink || !coursePrice || !lectures) {
      return res.status(400).json({
        error: "Please Provide All Information",
      });
    }

    const imgFiles = req.files['img']; // Get the thumbnail image file
    const pdfFiles = req.files['pdf']; // Get the PDF files

    let courseThumbnail = "";
    let coursePdf = "";

    if (imgFiles && imgFiles.length > 0) {
      // Handle the thumbnail image upload
      const imgUrls = await Promise.all(imgFiles.map(async (file) => {
        const pic = await cloudinary.uploader.upload(file.path);
        return pic.secure_url;
      }));

      courseThumbnail = imgUrls[0]; // Assuming only one thumbnail image is uploaded
    }

    if (pdfFiles && pdfFiles.length > 0) {
      // Handle the PDF files upload
      const pdfUrls = await Promise.all(pdfFiles.map(async (file) => {
        const pdf = await cloudinary.uploader.upload(file.path, { resource_type: "auto", response_type: "stream" });
        return pdf.secure_url;
      }));

      coursePdf = pdfUrls.join(',');
    }

    let savedLectures = [];

    // Parse the lectures string to an array of objects
    const parsedLectures = JSON.parse(lectures);
    
    if (Array.isArray(parsedLectures) && parsedLectures.length > 0) {
      // Save lectures
      savedLectures = await Promise.all(parsedLectures.map(async (lecture) => {
        const newLecture = new LectureModel({
          title: lecture.title,
          description: lecture.description,
          videoUrl: lecture.videoUrl,
          teacherId: req.user._id // Associate lecture with teacher
        });
        await newLecture.save();
        return newLecture._id;
      }));
    }

    // Save course details
    const course = new CourseModel({
      courseDescription,
      courseName,
      courseThumbnail,
      courseLink,
      coursePrice,
      coursePdf,
      teacher: req.user._id,
      lectures: savedLectures // Associate course with lectures
    });

    await course.save();

    // Update lecture objects with courseId
    await LectureModel.updateMany({ _id: { $in: savedLectures } }, { $set: { courseId: course._id } });

    return res.status(200).json({
      message: "Course and Lectures added successfully",
      course: course,
      lectures: savedLectures
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};


module.exports.getCourses__controller = async (req, res, next) => {
  try {
    const courses = await CourseModel.find().populate(
      "createdAt",
      "role _id userName email"
    );
    return res.status(200).json({
      courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong3",
    });
  }
};



module.exports.getOneCourse__controller = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const course = await CourseModel.findOne({ _id: courseId });
    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong4",
    });
  }
};

module.exports.deleteCourse__Controller = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    console.log(courseId)
    const course = await CourseModel.findOneAndDelete({ _id: courseId });
    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong5",
    });
  }
};

module.exports.getAllData = async (req, res) => {
  try {
      const allData = await CourseModel.find();
      if (!allData || allData.length === 0) {
          return res.status(400).json({
              success: false,
              message: "No data found"
          })
      }
      return res.status(200).json({
          success: true,
          message: "All data",
          data: allData
      })
  } catch (e) {
      return res.status(500).json({
          success: false,
          message: "Internal Server Error11",
      })
  }
}

module.exports.getItems__controller = async (req, res, next) => {
  try {
    const allData = await CourseModel.find();
    if (!allData || allData.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No data found"
        })
    }
    return res.status(200).json({
        success: true,
        message: "All data",
        data: allData
    })
} catch (e) {
    return res.status(500).json({
        success: false,
        message: "Internal Server Error1",
    })
}
};

exports.updateCourse = async (req, res) => {
  const { courseName, courseLink, courseDescription, coursePrice } = req.body;
  if (!courseName || !courseLink || !courseDescription || !coursePrice) {
      return res.status(400).json({ error: 'courseLink and coursePdf must be provided' });
  }

  try {
      const updatedUser = await CourseModel.findOneAndUpdate({ courseName }, { courseLink, courseDescription, coursePrice },{ new: true });
      if (!updatedUser) {
          return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: 'Course role updated successfully', user: updatedUser });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.getCoursesByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id; // Corrected this line

    const courses = await CourseModel.find({ teacher: userId }); // Corrected this line
    res.status(200).json({ success: true, courses: courses }); // Sending the courses as part of the response
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      courseThumbnail,
      courseLink,
      coursePrice,
      coursePdf,
      role,
      teacher
    } = req.body;

    // Create new course
    const newCourse = new CourseModel({
      courseName,
      courseDescription,
      courseThumbnail,
      courseLink,
      coursePrice,
      coursePdf,
      role,
      teacher
    });

    // Save new course
    const course = await newCourse.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


exports.addCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      courseThumbnail,
      courseLink,
      coursePrice,
      coursePdf,
      lectures,
    } = req.body;

    // Create lectures
    const createdLectures = await LectureModel.insertMany(lectures);

    // Create course with lectures
    const newCourse = new CourseModel({
      courseName,
      courseDescription,
      courseThumbnail,
      courseLink,
      coursePrice,
      coursePdf,
      lectures: createdLectures.map((lecture) => lecture._id),
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};





