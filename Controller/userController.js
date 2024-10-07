import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



//create new user
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;

        // Check if all fields are provided
        if (!firstName || !lastName || !phoneNumber || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Validate phone number
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: "Invalid number, please enter a 10-digit phone number",
                success: false,
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
            });
        }

        // Check if the user already exists (email)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({
                message: "User is already registered",
                success: false,
            });
        }

        // Check if the phone number is already registered
        const existingPhoneNumber = await User.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({
                message: "Phone number is already registered",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10).catch(err => {
            return res.status(500).json({
                message: "Error hashing password",
                success: false,
            });
        });

        // Create the new user
        const createdUser = await User.create({
            firstName,
            lastName,
            phoneNumber,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Return success response
        return res.status(200).json({
            message: "User is created successfully",
            data: createdUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};





// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
            });
        }

        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Find the user by email
        let user = await User.findOne({ email:email.toLowerCase()});

        // If user is not found
        if (!user) {
            return res.status(404).json({
                message: "User is not registered with this email",
            });
        }

        // Compare the passwords
        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(400).json({
                message: "Password is incorrect",
            });
        }


        // Create a user object without the password
        const withoutPassUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
        };

        console.log("WITHOUT PASS USER....", withoutPassUser)

        // Create a payload for JWT
        let payload = {
            id: user._id.toString(),
        };


        // Generate a token to store user id in cookies
        const token = await jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });


        // Set cookie and return success response
        return res
            .status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }) // storing token in cookies
            .json({
                message: "User logged in successfully",
                success: true,
                withoutPassUser,
            });

    } catch (error) {
        console.log(error);
    }
};



// Get LoggedIn user
export const getLoggedInUser = async (req, res) => {
    try {

        const userId=req.id;

        // Find the user by email
        const user = await User.findOne({userId});

       

        // If user is not found
        if (!user) {
            return res.status(400).json({
                message: "User not found with this email",
                success: false,
            });
        }

        const withoutPassUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
        };

        // Return success response
        return res.status(200).json({
            message: "User fetched successfully",
            data: withoutPassUser,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};


// Update user
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email } = req.body;
        const userid = req.id; // Ensure req.id is a valid string ID

        // Validate phone number
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: "Invalid number, please enter a 10-digit phone number",
                success: false,
            });
        }

         // Validate email format
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
            });
        }



        // Log to see what userid is
        // console.log("USER ID IN UPDATE USER:", userid);

        // Find the user by ID
        const user = await User.findById(userid);
        // console.log("Found User:", user);

        // If user is not found
        if (!user) {
            return res.status(404).json({
                message: "User not found with this ID",
            });
        }



        // Update the user information
        const updatedUser = await User.findByIdAndUpdate(
            userid,
            {
                firstName,
                lastName,
                phoneNumber,
                email:email.toLowerCase(),
            },
            { new: true } // Use { new: true } to return the updated document
        );


        // Return success response
        return res.status(200).json({
            message: "User updated successfully",
            updatedUser,
        });

    } catch (error) {
        console.error("Error in updating user:", error);
        return res.status(500).json({ message: "Server error" });
    }
};



// Delete a user
export const deleteLoggedInUser = async (req, res) => {
    try {
        const userId = req.id; // Ensure req.id contains the user's ID

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Return success response
        return res.status(200).json({
            message: "User deleted successfully",
            success: true,
        });
        
    } catch (error) {
        console.error("Error in deleting user:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};



// Delete specific user by email
export const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }

        // Find and delete user by email (convert email to lowercase for consistency)
        const deletedUser = await User.findOneAndDelete({ email: email.toLowerCase() });

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // If user is deleted successfully
        return res.status(200).json({
            message: "User deleted successfully",
            success: true,
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};
