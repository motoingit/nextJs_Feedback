// custum datatype is maded by interfacce genrally

import { Message } from "@/model/Message";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean; //signup mai tho req ni hota
  messages?: Array<Message>;
}
