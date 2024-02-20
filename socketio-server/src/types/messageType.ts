import type User from "./userType";

interface Message {
  user: User;
  type: "global" | "private";
  sender_id?: string;
  recipient_id?: string;
  text?: string;
  image?: string;
  url?: string;
  exiting?: boolean;
  timestamp: number;
  og?: {
    description?: string;
    image?: Array<{
      url: string;
      width: number;
      height: number;
      type: string;
    }>;
    siteName?: string;
    title?: string;
    url?: string;
  };
}

export default Message;
