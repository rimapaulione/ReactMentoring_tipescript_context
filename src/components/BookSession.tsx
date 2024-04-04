import { FormEvent, useEffect, useRef } from "react";
import Button from "./UI/Button";
import Modal, { type ModalHandler } from "./UI/Modal";
import Input from "./UI/Input";
import { Session, useSessionContext } from "../store/sessions-context";

type BookSessionProps = {
  onClose: () => void;
  session: Session;
};

function BookSession({ onClose, session }: BookSessionProps) {
  const modalRef = useRef<ModalHandler>(null);
  const sessionCtx = useSessionContext();

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.open();
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".modal-content")) {
        modalRef.current?.close();
      }
    };
    document.addEventListener("mousedown", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [modalRef]);

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data); // would normally be sent to a server, together with session data

    sessionCtx.bookSession(session);
    onClose();
  }

  return (
    <Modal onClose={onClose} ref={modalRef}>
      <h2>Book Session</h2>
      <form onSubmit={submitHandler}>
        <Input label="Your name" id="name" type="text" />
        <Input label="Your email" id="email" type="email" />
        <p className="actions">
          <Button type="button" textOnly onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Book Session</Button>
        </p>
      </form>
    </Modal>
  );
}

export default BookSession;
