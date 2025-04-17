import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    fullName: string({
      required_error: "Full name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    profilePic: string().optional(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const updateProfileSchema = object({
  body: object({
    profilePic: string().optional(),
  }),
});

export type UpdateProfileInput = TypeOf<typeof updateProfileSchema>;

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;

export const getUsersForSidebarSchema = object({
  body: object({
    userId: string(),
  }),
});

export type GetUsersForSidebarInput = TypeOf<typeof getUsersForSidebarSchema>;
