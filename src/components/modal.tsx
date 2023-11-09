import React, { useRef, useEffect, useState } from "react";
import "../index.css";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  hasCloseBtn?: boolean;
  buttonText?: string;
  onClose?: (buttonPressed: boolean) => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, title = null, buttonText, onClose, children }) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = (buttonPressed = false) => {
    if (onClose) {
      onClose(buttonPressed);
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal(false);
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown} className="modal">
      {title !== null &&
        <div className="modal-title">
          {title}
        </div>}
      <div className="modal-body">
        <div className="modal-content">
          {children}
        </div>
        <div className="relative">
          {buttonText !== undefined && (
            <button className="button" onClick={() => handleCloseModal(true)}>{buttonText}</button>
          )}
        </div>
      </div>
      <button className="modal-close-btn" onClick={() => handleCloseModal()}>X</button>
    </dialog>
  );
};

export default Modal;