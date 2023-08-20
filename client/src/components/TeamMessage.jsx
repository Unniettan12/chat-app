import React from "react";
import { MessageSimple, useMessageContext } from "stream-chat-react";

const TeamMessage = () => {
  const { message } = useMessageContext();
  console.log(message);
  return <MessageSimple message={message} />;
};

export default TeamMessage;
