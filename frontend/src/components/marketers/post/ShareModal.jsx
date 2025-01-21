import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Linkedin, Facebook, Twitter, Copy, Instagram, Send, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShareModal = ({ isOpen, onClose, sharingLink }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ShareButton = ({ icon: Icon, label, href }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-800 border border-gray-300 transition-colors duration-300 hover:bg-gray-100"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={16} />
      {label}
    </motion.a>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Share this Post</h2>
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-gray-100 rounded-lg">
                <QRCodeCanvas value={sharingLink} size={180} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Share this link with your network or scan the QR code to view the post.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <ShareButton icon={Linkedin} label="LinkedIn" href={`https://www.linkedin.com/shareArticle?mini=true&url=${sharingLink}`} />
              <ShareButton icon={Facebook} label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${sharingLink}`} />
              <ShareButton icon={Twitter} label="Twitter" href={`https://twitter.com/intent/tweet?url=${sharingLink}`} />
              <ShareButton icon={Instagram} label="Instagram" href="https://www.instagram.com/" />
              <ShareButton icon={Send} label="WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(sharingLink)}`} />
              <motion.button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  copied 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-800 border border-gray-300 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </motion.button>
            </div>
            <motion.button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;