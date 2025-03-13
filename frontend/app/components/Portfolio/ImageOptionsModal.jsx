// ImageOptionsModal.jsx
export const ImageOptionsModal = ({ onClose, onChooseFromComputer, onChooseFromGallery }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 text-center">
          <h2 className="text-xl font-bold mb-4">Choose Image</h2>
          <button
            onClick={onChooseFromComputer}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mb-2 hover:bg-blue-600 transition duration-200"
          >
            Choose from your computer
          </button>
          <button
            onClick={onChooseFromGallery}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Choose from gallery
          </button>
          <button
            onClick={onClose}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  };