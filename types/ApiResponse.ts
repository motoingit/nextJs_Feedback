// custum datatype is maded by interfacce genrally

import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean; //signup mai tho req ni hota
  messages?: Array<Message>;
}
