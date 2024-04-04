import { type ReactNode, createContext, useReducer, useContext } from "react";

export type Session = {
  id: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  image: string;
  duration: number;
};
type SessionsState = {
  sessions: Session[];
};
type SessionsContextType = SessionsState & {
  bookSession: (sesion: Session) => void;
  cancelSession: (id: string) => void;
};
const SessionsContext = createContext<SessionsContextType | null>(null);

const initState: SessionsState = {
  sessions: [],
};

type BookSessionAction = {
  type: "BOOK_SESSION";
  payload: Session;
};
type CancelSessionAction = {
  type: "CANCEL_SESSION";
  id: string;
};

type Action = BookSessionAction | CancelSessionAction;

function sessionReducer(state: SessionsState, action: Action): SessionsState {
  switch (action.type) {
    case "BOOK_SESSION":
      if (state.sessions.some((session) => session.id === action.payload.id)) {
        return state;
      }
      return { sessions: [...state.sessions, action.payload] };

    case "CANCEL_SESSION":
      return {
        sessions: state.sessions.filter((session) => session.id !== action.id),
      };

    default:
      return state;
  }
}

export default function SessionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(sessionReducer, initState);

  function bookSession(session: Session) {
    dispatch({ type: "BOOK_SESSION", payload: session });
  }

  function cancelSession(id: string) {
    dispatch({ type: "CANCEL_SESSION", id });
  }

  const valueCtx: SessionsContextType = {
    sessions: state.sessions,
    bookSession,
    cancelSession,
  };

  return (
    <SessionsContext.Provider value={valueCtx}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessionContext() {
  const sessionCtx = useContext(SessionsContext);
  if (!sessionCtx) {
    throw new Error(
      "useSessionsContext must be used within a SessionsContextProvider"
    );
  }
  return sessionCtx;
}
