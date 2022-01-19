import { useState } from "react";
import { useForm } from "react-hook-form";
import { axios } from "../helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useNavigate } from "react-router-dom";

export const verifyUserSchema = object({
  id: string().nonempty({
    message: "id is required",
  }),
  verificationCode: string().nonempty({
    message: "verification code is required",
  }),
});

type CreateUserInput = TypeOf<typeof verifyUserSchema>;

function RegisterPage() {
  const [verifyError, setVerifyError] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(verifyUserSchema),
  });
  let navigate = useNavigate();

  async function onSubmit(values: CreateUserInput) {
    try {
      await axios.post(
        `/api/users/verify/${values.id}/${values.verificationCode}`
      );
      navigate("/login");
    } catch (e: any) {
      setVerifyError(e.message);
    }
  }

  return (
    <>
      <p>{verifyError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="id">ID</label>
          <input id="id" type="text" placeholder="" {...register("id")} />
          <p>{errors.id?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="verificationCode">Verification Code</label>
          <input
            id="verificationCode"
            type="text"
            placeholder=""
            {...register("verificationCode")}
          />
          <p>{errors.verificationCode?.message}</p>
        </div>

        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default RegisterPage;
