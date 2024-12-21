/* eslint-disable no-undef */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { BeatLoader } from "react-spinners"; 

// Fungsi untuk mengirim email verifikasi
const sendVerification = async (email) => {
  try {
    const response = await fetch("/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), 
    });

    const data = await response.json(); 

    if (response.ok) {
      return data.message; 
    } else {
      throw new Error(data.message || "Something went wrong."); 
    }
  } catch (error) {
    throw new Error(error.message); 
  }
};

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false); 
  const [sendingVerification, setSendingVerification] = useState(false); 

  const handleInputChange = (e) => {
    setEmail(e.target.value); 
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    setError('');
    setMessage(''); 

    try {
      const responseMessage = await sendVerification(email); 
      setMessage(responseMessage); 
      setVerificationSent(true); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setSendingVerification(false); 
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(''); 
    setMessage(''); 

    try {
      setMessage("Password reset link sent to your email."); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
<Card>
  <CardHeader>
    <CardTitle>{verificationSent ? "Change Your Password" : "Forgot Password"}</CardTitle>
  </CardHeader>

  <CardContent>
    {!verificationSent ? (
      <>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleInputChange}
          value={email}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-500 text-sm">{message}</div>}
      </>
    ) : (
      <>
        <Input
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          onChange={handleNewPasswordChange}
          value={newPassword}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          onChange={handleConfirmPasswordChange}
          value={confirmPassword}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-500 text-sm">{message}</div>}
      </>
    )}
  </CardContent>

  <CardFooter>
    {!verificationSent ? (
      <Button onClick={handleSendVerification} disabled={sendingVerification}>
        {sendingVerification ? (
          <BeatLoader size={10} color="#36d7b7" />
        ) : (
          "Send Verification Email"
        )}
      </Button>
    ) : (
      <Button onClick={handleResetPassword} disabled={loading}>
        {loading ? (
          <BeatLoader size={10} color="#36d7b7" />
        ) : (
          "Reset Password"
        )}
      </Button>
    )}
  </CardFooter>
</Card>
);
};

export default ResetPassword;
