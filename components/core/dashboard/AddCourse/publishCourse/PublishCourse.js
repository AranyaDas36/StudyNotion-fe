import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { COURSE_STATUS } from "../../../../../utils/constants";
import {
  resetCourseState,
  setStep,
} from "../../../../../redux/slices/courseSlice";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handelOnSubmit = async () => {
    if (
      (course.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData, token);

    if (result) {
      goToCourses();
    }
    setLoading(false);
  };
  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>

      <form onSubmit={handleSubmit(handelOnSubmit)}>
        <label className="flex items-center text-lg my-6">
          <input
            name="public"
            type="checkbox"
            {...register("public")}
            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
          ></input>
          <span className="ml-2 text-richblack-400">
            Make this course as public
          </span>
        </label>

        <div className="flex justify-end items-center gap-5">
          <button
            className="py-3 px-4 rounded-md bg-richblack-100 text-richblack-900 font-semibold"
            type="button"
            onClick={goBack}
          >
            Back
          </button>
          <button
            className="py-3 px-4 rounded-md bg-yellow-50 text-richblack-900 font-semibold"
            type="submit"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
