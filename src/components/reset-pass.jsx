import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { BeatLoader } from "react-spinners"; 
import { useNavigate} from "react-router-dom";
const URL_API = import.meta.env.VITE_API_URL;
// Fungsi untuk mengirim email verifikasi
const sendVerification = async (email) => {
  try {
    const response = await fetch(`${URL_API}/auth/forgot-password`, {
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
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // const [verificationSent, setVerificationSent] = useState(false); 
  const [sendingVerification, setSendingVerification] = useState(false); 
  const [token, setToken] = useState(null); // Token state

  useEffect(() => {
    // Ambil token dari URL jika tersedia
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    }
  }, []);

  const handleInputChange = (e) => {
    setEmail(e.target.value); 
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Fungsi untuk mengirimkan verifikasi
  const handleSendVerification = async () => {
    setSendingVerification(true);
    setError('');
    setMessage(''); 

    try {
      const responseMessage = await sendVerification(email); 
      setMessage(responseMessage); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setSendingVerification(false); 
    }
  };

  // Fungsi untuk mereset password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Lakukan request untuk mereset password
      const response = await fetch(`${URL_API}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset successfully.");
        navigate('/auth')
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.message); // Menangani error jika request gagal
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{token ? "Change Your Password" : "Forgot Password"}</CardTitle>
      </CardHeader>

      <CardContent>
        {!token ? (
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
        {!token ? (
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
