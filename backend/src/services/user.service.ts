import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import cloudinary from "../utils/cloudinary";
import { GetUsersForSidebarInput } from "../schemas/user.schema";

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);

    return omit(user.toJSON(), ["password", "session", "exp", "iat"]);
  } catch (e: unknown) {
    throw new Error(e instanceof Error ? e.message : "Unknown error");
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await (user as unknown as UserDocument).comparePassword(
    password
  );

  if (!isValid) return false;

  return omit(user.toJSON(), ["password", "session", "exp", "iat"]);
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function findUsersForSidebar(input: GetUsersForSidebarInput) {
  const loggedInUserId = input.body.userId;

  const filteredUsers = await UserModel.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  return filteredUsers;
}

export async function updateUser(input: UserDocument) {
  try {
    const { profilePic } = input;
    const userId = input._id;

    if (!profilePic) {
      throw new Error("Profile pic is required");
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      resource_type: "auto",
      folder: "profile-pics",
    });
    console.log("uploadResponse", uploadResponse);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    return omit(updatedUser?.toJSON(), ["password", "session", "exp", "iat"]);
  } catch (e: unknown) {
    throw new Error(e instanceof Error ? e.message : "Unknown error");
  }
}
