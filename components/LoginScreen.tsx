import { supabase } from "@/utils/api";
import Modal from "@/components/Modal";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Alert from "@/components/Alert";

import { useState } from "react";
import Spinner from "./Spinner";

import type { AlertMessage } from "@/types/appTypes";

export default NiceModal.create(() => {
  const modal = useModal();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<null | AlertMessage>(null);

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      setMessage({
        level: "success",
        text: "Check your email for a login link",
      });
    } catch (error: any) {
      setMessage({
        level: "error",
        text: error.error_description || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessage(null);
    setEmail("");
    setLoading(false);
  };

  return (
    <Modal title="Login" closeModal={modal.remove}>
      {!message && (
        <form className="my-5">
          <p>Sign in via magic link with your email below</p>
          <div className="">
            <input
              className="w-full"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleLogin(email);
              }}
              className="button yellow mt-5 w-full"
              disabled={loading}
            >
              {!loading ? (
                <>
                  <i className="fas fa-envelope mr-2" />
                  <span>Send magic link</span>
                </>
              ) : (
                <>
                  <Spinner className="inline h-4 w-4 mr-2" />
                  <span>sending</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
      {message?.level && message?.text && (
        <>
          <Alert level={message.level}>{message.text}</Alert>
          <div className="text-right mt-3">
            <button className="hover:text-yellow-500 px-3" onClick={reset}>
              log in again
            </button>
            <button
              className="hover:text-yellow-500 px-3"
              onClick={modal.remove}
            >
              close
            </button>
          </div>
        </>
      )}
    </Modal>
  );
});
