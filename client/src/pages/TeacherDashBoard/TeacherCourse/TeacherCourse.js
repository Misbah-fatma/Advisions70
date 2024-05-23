import React, { useEffect, useState, useMemo } from "react";
import Sidebar from '../SideBar'
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourseInfo, deleteCourseItem } from "../../../redux/course/courseAction";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const CourseInfo = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      const userDataFromStorage = localStorage.getItem('user');
      if (userDataFromStorage) {
        setUserData(JSON.parse(userDataFromStorage));
      }
    }, []);
  
    const userId = userData ? userData._id : null;
    const courseData = useSelector((state) => state.course.courseInfo || []);
  
    useEffect(() => {
      dispatch(fetchAllCourseInfo());
    }, [dispatch]);
  
    const filteredCourses = useMemo(() => Array.isArray(courseData) ? 
    courseData.filter(course => course.teacher === userId) : [], [courseData, userId]);
  
    const deleteCourseHandler = (courseId) => {
      dispatch(deleteCourseItem(courseId));
    };
  
  return (
    <div>
     
        <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
    
        <div className="app-main">
        <Sidebar/>
        <div className="app-main-outer">
        <div className="app-main-inner">
            <div className="page-title-actions px-3 d-flex">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="https://admin.razinskills.com">Dashboard</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Course</li>
                    </ol>
                </nav>
                <div className="ms-auto mb-3">
                    <Link to="/newteachercourses" className="btn-shadow mr-3 btn btn-dark ms-auto">
                        + New Course
                    </Link>
                </div>
            </div>

            <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                    <div className="card mb-5">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table id="dataTable" className="table table-responsive-xl">
                                    <thead>
                                        <tr>
                                          
                                            <th><strong>ID</strong></th>
                                            <th><strong>Course</strong></th>
                                            <th><strong>Description</strong></th>
                                            <th><strong>Price</strong></th>
                                            <th><strong>Instructor</strong></th>
                                            <th><strong>Course Link</strong></th>
                                            <th><strong>Status</strong></th>
                                            <th><strong>Action</strong></th>
                                        </tr>
                                    </thead>
                                    {filteredCourses.map((row) => (
                                    <tbody>
                                 
                                 <tr key={row._id}>
                                                <td className="tableId">{row._id}</td>
                                              
                                                <td className="tableProduct">
                                                    <div className="listproduct-section">
                                                        <div className="listproducts-image">
                                                        <img
                    style={{
                      height: "40px",
                      width: "60px",
                      objectFit: "contain",
                    }}
                    src={row.courseThumbnail}
                    alt=""
                  />
                                                        </div>
                                                        <div className="product-pera">
                                                            <p className="priceDis">
                                                            {row.courseName}
                                                                                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="tableCustomar">
                                                {row.courseName}</td>
                                                <td className="tableId">  {row.coursePrice}</td>
                                                <td className="tableId">
                                                {row.teacher}
                                                                                                    </td>
                                                <td className="tableId">{row.courseLink}</td>
                                                <td className="tableStatus">
                                                                                                            <div className="statusItem">
                                                            <div className="circleDot animatedCompleted"></div>
                                                            <div className="statusText">
                                                                <span className="stutsCompleted">Active</span>
                                                            </div>
                                                        </div>
                                                                                                    </td>
                                                <td className="tableAction">
                                                    <div className="action-icon">
                                              <Link data-bs-toggle="tooltip" data-bs-placement="top"
                                                                data-bs-custom-className="custom-tooltip"
                                                                data-bs-title="Edit Course"
                                                                to="/updatedashCourse"><EditIcon color="primary" /></Link>
                                                                     
                                                       <IconButton onClick={() => deleteCourseHandler(row._id)}>
                    <DeleteIcon style={{ color: "red" }} />
                  </IconButton>
                                                                                                            </div>
                                                </td>
                                            </tr>
                                                
                                                                                                                                                        
                                                                            </tbody>
                                      ))}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    </div>
    </div>
    </div>
  )
}

export default CourseInfo