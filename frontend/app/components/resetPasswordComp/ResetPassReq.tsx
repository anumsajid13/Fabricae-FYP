import { useState } from 'react';


interface ResetReqModalProps {
  onSubmit: (email: string) => void; 
  onClose: () => void; 
}

const ResetReqModal: React.FC<ResetReqModalProps> = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState<string>(""); 

  const handleSubmit = () => {
    if (email) {
     
      onSubmit(email);
      onClose(); 
    } else {
     
      alert("Please enter a valid email.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl max-w-sm w-full">
        <h2 className="text-lg text-black font-semibold text-center mb-4">Reset Your Password</h2>
        <div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="mt-2 px-3 py-2 border border-gray-300 rounded-2xl text-black w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit} 
              className="text-sm text-white bg-[#822538] px-4 py-2 rounded-2xl"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetReqModal;
