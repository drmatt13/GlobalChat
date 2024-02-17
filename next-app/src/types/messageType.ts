import type User from "@/types/userType";

interface Message {
  user: User;
  text?: string;
  image?: string;
  urls?: string[];
  timestamp: number;
  exiting?: boolean;
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
