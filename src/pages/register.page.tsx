import { useState } from "react";
import { useForm } from "react-hook-form";
import { axios } from "../helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useNavigate } from "react-router-dom";

const createUserSchema = object({
  firstName: string().nonempty({
    message: "First name is required",
  }),
  lastName: string().nonempty({
    message: "Last name is required",
  }),
  password: string()
    .min(6, "Password too short - should be 6 chars minimum")
    .nonempty({
      message: "Password is required",
    }),
  passwordConfirmation: string().nonempty({
    message: "passwordConfirmation is required",
  }),
  email: string({
    required_error: "Email is required",
  })
    .email("Not a valid email")
    .nonempty({
      message: "Password is required",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage() {
  const [registerError, setRegisterError] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });
  let navigate = useNavigate();

  async function onSubmit(values: CreateUserInput) {
    try {
      await axios.post("/api/users", values);
      navigate("/verify");
    } catch (e: any) {
      setRegisterError(e.message);
    }
  }

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            type="text"
            placeholder="jane"
            {...register("firstName")}
          />
          <p>{errors.firstName?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="lastname">Last Name</label>
          <input
            id="lastname"
            type="text"
            placeholder="doe"
            {...register("lastName")}
          />
          <p>{errors.lastName?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Confirm password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="*********"
            {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default RegisterPage;
