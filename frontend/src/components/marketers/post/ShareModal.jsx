import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Facebook, Twitter, Copy } from 'lucide-react'; // Import from lucide-react instead of react-feather

const ShareModal = ({ isOpen, onClose, sharingLink }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharingLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Added z-50 to ensure the modal is on top */}
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg z-50">
        <h2 className="text-xl font-semibold mb-4">Share this Post</h2>
        <div className="mb-4">
          <QRCodeCanvas value={sharingLink} size={150} />
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Share this link with your friends or scan the QR code to view the post.
        </p>
        <div className="flex gap-3 mb-4">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${sharingLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <Facebook size={16} />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${sharingLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-400 rounded hover:bg-blue-500"
          >
            <Twitter size={16} />
            Twitter
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(sharingLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
          >
            WhatsApp
          </a>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-gray-700 rounded hover:bg-gray-800"
        >
          <Copy size={16} />
          Copy Link
        </button>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
