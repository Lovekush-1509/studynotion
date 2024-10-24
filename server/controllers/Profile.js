const { default: mongoose } = require("mongoose");
const Profile = require("../models/profile");
const User = require("../models/user");
require("dotenv").config();
const {uploadToCloudinary} = require("../utils/uploadToCloudinary");

exports.updateProfile = async(req,res) =>{
    try{
        const {DOB,contactNo,Gender,about} = req.body;
        const id = req.user.id;
        if(!contactNo || !Gender){
            return res.json({
                success:false,
                meassage:'All fields are required',
            });
        }
        const user = await User.findById(id);
        console.log(user.additionalInfo);
        const profileId = user.additionalInfo;
        const updatedProfile = await Profile.findById(profileId);
        updatedProfile.DOB = DOB;
        updatedProfile.contactNo = contactNo;
        updatedProfile.Gender = Gender;
        updatedProfile.About = about;
        await updatedProfile.save();
        return res.json({
            success:true,
            message:"Profile updated succesfully",
        });
    }catch(e){
        return res.json({
            success:false,
            error:e.message,
            message:"unable to update Profile",
        });
    }
}


exports.deleteProfile = async(req,res) =>{
    try{
        const id = req.user.id;
        console.log(id);
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.json({
                success:false,
                meassage:'User not found',
            });
        }

        const profileId = userDetails.additionalInfo;
        const updatedProfile = await Profile.findByIdAndDelete(profileId);
        // const allCourses = await Course.findByIdAndDelete(id);
        await User.findByIdAndDelete(id);
        // await updatedProfile.save();
        return res.json({
            success:true,
            message:"Profile deleted succesfully",
        });
    }catch(e){
        return res.json({
            success:false,
            message:"unable to delete Profile",
            error:e.message,
        });
    }
}

exports.getUserDetails = async(req,res) =>{
    try{
        const userId = req.user.id;
        const detailes = await User.findById({_id:userId}).populate("additionalInfo")
                                                .populate({path:"courses",
                                                    populate:{
                                                        path:"courseContent",
                                                    }
                                                });
        if(!detailes){
            return res.json({
                success:false,
                message:"No course found",
            });
        }
        return res.json({
            success:true,
            message:"course found",
            data:detailes,
        }); 
    }catch(e){
        return res.json({
            success:false,
            message:e.meassage,
        });
    }
}

exports.updateProfilePic = async(req,res) =>{
    try{
        const file = req.files.image;
        const userId = req.user.id;
        
        const cloudinaryUpload = await uploadToCloudinary(file,process.env.FOLDER_NAME);
        // console.log(cloudinaryUpload.secure_url);
        const updatedDetails = await User.findByIdAndUpdate({_id:userId},
                                                            {
                                                                image:cloudinaryUpload.secure_url,
                                                            },{new:true}
        );

        if(!updatedDetails){
            return res.json({
                success:false,
                message:"No user Found",
            });
        }
        return res.json({
            success:true,
            message:"updated succesfully",
            data:updatedDetails,
        }); 
    }catch(e){
        return res.json({
            success:false,
            mess:"nhi hua bhai",
            message:e.meassage,
        });
    }
}


exports.getEnrolledCourse = async(req,res) =>{
    try{
        const userId = req.user.id;
        const courses = User.findById({_id:userId},{courses:true}).populate("courses");
        if(!courses){
            return res.json({
                success:false,
                message:"No course found",
            });
        }
        return res.json({
            success:true,
            message:"course found succesfully",
            data:courses,
        }); 
    }catch(e){
        return res.json({
            success:false,
            message:e.message,
        }); 
    }
}


