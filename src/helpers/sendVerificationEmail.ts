import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "noreply@sapkotasandip.com.np",
      to: email,
      subject: "Email Verification",
      react: VerificationEmail({ username, otp }),
    });
    return {
      success: true,
      message:
        "A verification email has been sent to your email address. Please check your inbox.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "An error occurred while sending the verification email. Please try again later.",
    };
  }
}
