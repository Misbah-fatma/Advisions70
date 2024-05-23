const {
  getStudent__controller,
  getTeacher__controller,
  deleteTeacher__controller,
  createUser__controller,
  createUser,
  updateUserRole,
  deleteUser,
  updateUserPassword,
  updateUserActiveStatus
} = require("../controllers/userController");
const { adminAuthentication, studentAuthentication, teacherAuthentication } = require("../middlewares/authentication");
const { requireLogin } = require("../middlewares/requireLogin");

const router = require("express").Router();

router.get(
  "/student",
  requireLogin,
  getStudent__controller
);


router.get(
  "/teacher",
  requireLogin,

  getTeacher__controller
); 


router.get(
  "/delete-teacher",
  requireLogin,
  adminAuthentication,
  deleteTeacher__controller
);

router.post('/createUser',

 createUser
);

router.put('/updateRole', 
updateUserRole
);

router.put('/updatePassword', 
updateUserPassword
);

router.delete('/:userId', 
deleteUser);

router.put('/:id/active', updateUserActiveStatus);


router.get('/user/history', async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const user = await UserModel.findById(userId).populate('codeHistory');
    res.json({ files: user.codeHistory.map(code => code.fileName) });
  } catch (error) {
    console.error('Error fetching user code history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;